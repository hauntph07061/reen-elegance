package com.greenelegance.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/upload")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UploadController {

    private final Path fileStorageLocation;

    public UploadController() {
        this.fileStorageLocation = Paths.get("./uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @PostMapping
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng chọn file hợp lệ."));
        }

        try {
            String originalFileName = file.getOriginalFilename();
            String extension = originalFileName != null && originalFileName.contains(".") 
                    ? originalFileName.substring(originalFileName.lastIndexOf(".")) 
                    : "";
            
            String newFileName = UUID.randomUUID().toString() + extension;
            Path targetLocation = this.fileStorageLocation.resolve(newFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/")
                    .path(newFileName)
                    .toUriString();

            return ResponseEntity.ok(Map.of("url", fileDownloadUri));
        } catch (IOException ex) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Không thể lưu file. Lỗi: " + ex.getMessage()));
        }
    }
}
