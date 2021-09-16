package com.example.Authentication.File;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
@RequestMapping("/file")
@RestController
public class FileController {
    @Autowired
    private FileService service;

    @GetMapping("/{id}")
    public String downloadFile(@PathVariable long id) {
        return service.downloadFile(id);
    }
    @PostMapping("/{id}")
    public String uploadFile(@PathVariable long id) {
        return service.uploadFile(id);
    }
    @DeleteMapping("/{id}")
    public String deleteFile(@PathVariable long id) {
        return service.uploadFile(id);
    }
}

