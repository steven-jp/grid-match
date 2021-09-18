package com.example.Authentication.File;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.S3Object;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
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

    public String getFile(String key) {
        S3Object s3Object = client.getObject(bucket,key);
        System.out.println("file key : " + s3Object.getKey());
    return "success";
    }

    public ResponseEntity<?> uploadFile(MultipartFile multipartFile) {
        File file = null;
        try {
            file = multiPartFileToFile(multipartFile);
        } catch (IOException e) {
            return responseBuilder("File failed to upload", HttpStatus.BAD_REQUEST);
        }
        client.putObject(bucket, System.currentTimeMillis()+file.getName(), file);
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

