package com.example.Authentication.File;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.amazonaws.util.IOUtils;
import com.example.Authentication.Security.UserDetailsImpl;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.List;
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
        S3Object s3Object = client.getObject(bucket,getUserStorageLocation()+key);
        S3ObjectInputStream inputStream = s3Object.getObjectContent();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        IOUtils.copy(inputStream, outputStream);

        byte[] byteArray = IOUtils.toByteArray(s3Object.getObjectContent());
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(outputStream.toByteArray());
    }
    public ResponseEntity<?> getAllFileKeys() throws IOException {
        String prefix = getUserStorageLocation();
        ListObjectsV2Request req = new ListObjectsV2Request().withBucketName(bucket).withPrefix(prefix).withDelimiter("/");
        ListObjectsV2Result res = client.listObjectsV2(req);
        List<S3ObjectSummary> summaries = res.getObjectSummaries();
        String[] fileNames = new String[summaries.size()];

        //remove prefix from s3 key
        for (int i = 0; i < summaries.size(); i++) {
            fileNames[i] = summaries.get(i).getKey().substring(prefix.length());
        }

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
        client.putObject(bucket, getUserStorageLocation() + System.currentTimeMillis()+file.getName(), file);
        file.delete();
        return responseBuilder("Successfully uploaded file : " + file.getName(), HttpStatus.OK);
    }

    public ResponseEntity<?> deleteFile(String key) {
        client.deleteObject(bucket, getUserStorageLocation() + key);
        return responseBuilder("Successfully deleted file", HttpStatus.OK);
    }

    /* Get storage location of user images */
    public String getUserStorageLocation(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String user = (String) auth.getPrincipal();
        return user + "/";
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

