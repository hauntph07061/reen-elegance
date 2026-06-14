package com.greenelegance.api.controller;

import com.greenelegance.api.service.ImageUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/upload")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class UploadController {

    private final ImageUploadService imageUploadService;

    @PostMapping
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng chọn file hợp lệ."));
        }

        try {
            String fileUrl = imageUploadService.uploadFile(file);
            return ResponseEntity.ok(Map.of("url", fileUrl));
        } catch (IOException ex) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Không thể lưu file. Lỗi: " + ex.getMessage()));
        }
    }
}
