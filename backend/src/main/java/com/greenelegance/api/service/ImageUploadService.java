package com.greenelegance.api.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.greenelegance.api.util.MessageConstants;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@Service
public class ImageUploadService {

    private final Path fileStorageLocation;
    private Cloudinary cloudinary;

    public ImageUploadService(@Value("${cloudinary.url:}") String cloudinaryUrlEnv) {
        // Fallback check: Look at CLOUDINARY_URL env var if not set in properties
        String cloudinaryUrl = System.getenv("CLOUDINARY_URL");
        if (cloudinaryUrl == null || cloudinaryUrl.trim().isEmpty()) {
            cloudinaryUrl = cloudinaryUrlEnv;
        }

        if (cloudinaryUrl != null && !cloudinaryUrl.trim().isEmpty()) {
            try {
                this.cloudinary = new Cloudinary(cloudinaryUrl);
                System.out.println("====== CLOUDINARY INITIALIZED SUCCESSFULY ======");
            } catch (Exception e) {
                System.err.println("Failed to initialize Cloudinary, falling back to local storage: " + e.getMessage());
                this.cloudinary = null;
            }
        } else {
            System.out.println("====== CLOUDINARY URL NOT DETECTED. FALLING BACK TO LOCAL FILE STORAGE ======");
        }

        // Initialize local storage folder in case of fallback
        this.fileStorageLocation = Paths.get("./uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException(MessageConstants.FILE_STORAGE_CREATE_ERROR, ex);
        }
    }

    public String uploadFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException(MessageConstants.FILE_IS_EMPTY);
        }

        // If Cloudinary is configured, upload to cloud
        if (this.cloudinary != null) {
            try {
                Map<?, ?> uploadResult = this.cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
                return (String) uploadResult.get("secure_url");
            } catch (Exception e) {
                System.err.println("Cloudinary upload failed, trying local storage fallback: " + e.getMessage());
            }
        }

        // Local storage fallback
        String originalFileName = file.getOriginalFilename();
        String extension = originalFileName != null && originalFileName.contains(".")
                ? originalFileName.substring(originalFileName.lastIndexOf("."))
                : "";

        String newFileName = UUID.randomUUID().toString() + extension;
        Path targetLocation = this.fileStorageLocation.resolve(newFileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path(newFileName)
                .toUriString();
    }
}
