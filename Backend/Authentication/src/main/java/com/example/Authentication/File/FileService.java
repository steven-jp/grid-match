package com.example.Authentication.File;

import org.springframework.stereotype.Service;

@Service
public class FileService {

    public String downloadFile(long id) {
        return "TEST download";
    }
    public String uploadFile(long id) {
        return "TEST upload";
    }
    public String deleteFile(long id) {
        return "TEST delete";
    }
}

