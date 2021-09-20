package com.example.Authentication.File;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
@RequestMapping("/file")
@RestController
public class FileController {
    @Autowired
    private FileService service;

    @GetMapping(value = "/{key}")
    public ResponseEntity<?> getFile(@PathVariable String key) throws IOException {
        return service.getFile(key);
    }
    @GetMapping
    public ResponseEntity<?> getAllFileKeys() throws IOException {
        return service.getAllFileKeys();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile multipartFile) {
        return service.uploadFile(multipartFile);
    }
    @DeleteMapping("/{key}")
    public ResponseEntity<?> deleteFile(@PathVariable String key) {
        return service.deleteFile(key);
    }

}

