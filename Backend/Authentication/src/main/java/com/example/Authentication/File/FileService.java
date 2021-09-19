package com.example.Authentication.File;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.util.IOUtils;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.Objects;

@Service
public class FileService {
    @Autowired
    private AmazonS3 client;

    @Autowired
    @Qualifier("AwsBucket")
    private String bucket;

    @Autowired
    @Qualifier("AwsRegion")
    private String region;

    public ResponseEntity<?> getFile(String key) throws IOException {
        S3Object s3Object = client.getObject(bucket,key);
        S3ObjectInputStream inputStream = s3Object.getObjectContent();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        IOUtils.copy(inputStream, outputStream);

        byte[] byteArray = IOUtils.toByteArray(s3Object.getObjectContent());
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
//                .body(byteArray);
                .body(outputStream.toByteArray());
    }
    public ResponseEntity<?> getAllFileKeys() throws IOException {
        String[] fileNames = new String[]{"1632016381977Screen Shot 2021-06-28 at 12.37.06 PM.png","1632084925709Screen Shot 2021-06-28 at 12.33.11 PM.png"};

        return ResponseEntity.ok()
                .body(fileNames);
    }

    public ResponseEntity<?> uploadFile(MultipartFile multipartFile) {
        File file = null;
        try {
            file = multiPartFileToFile(multipartFile);
        } catch (IOException e) {
            return responseBuilder("File failed to upload", HttpStatus.BAD_REQUEST);
        }
        client.putObject(bucket, System.currentTimeMillis()+file.getName(), file);
        file.delete();
        return responseBuilder("Successfully uploaded file : " + file.getName(), HttpStatus.OK);
    }

    public ResponseEntity<?> deleteFile(String key) {
        client.deleteObject(bucket, key);
        return responseBuilder("Successfully deleted file", HttpStatus.OK);
    }

    public File multiPartFileToFile(MultipartFile multipartFile) throws IOException {
        File file = new File(Objects.requireNonNull(multipartFile.getOriginalFilename()));
        FileOutputStream fileOutputStream = new FileOutputStream(file);
        fileOutputStream.write(multipartFile.getBytes());
        fileOutputStream.close();
        return file;
    }

    private ResponseEntity<Object> responseBuilder(String msg, HttpStatus status){
        JSONObject json = new JSONObject();
        json.appendField("Message", msg);
        return new ResponseEntity<Object>(json,status);
    }

}

