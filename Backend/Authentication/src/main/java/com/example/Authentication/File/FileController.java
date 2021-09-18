package com.example.Authentication.File;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
@RequestMapping("/file")
@RestController
public class FileController {
    @Autowired
    private FileService service;

    @GetMapping("/{key}")
    public String getFile(@PathVariable String key) {
        return service.getFile(key);
    }
//    @PostMapping("/{id}")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile multipartFile) {
        return service.uploadFile(multipartFile);
    }
    @DeleteMapping("/{key}")
    public ResponseEntity<?> deleteFile(@PathVariable String key) {
        return service.deleteFile(key);
    }

}

