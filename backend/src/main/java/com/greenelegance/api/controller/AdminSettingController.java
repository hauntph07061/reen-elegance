package com.greenelegance.api.controller;

import com.greenelegance.api.entity.Setting;
import com.greenelegance.api.service.SettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/settings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminSettingController {

    private final SettingService settingService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Setting>> getAllSettings() {
        return ResponseEntity.ok(settingService.getAllSettings());
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateSettings(@RequestBody Map<String, String> updates) {
        settingService.updateSettings(updates);
        return ResponseEntity.ok("Cập nhật thành công!");
    }
}
