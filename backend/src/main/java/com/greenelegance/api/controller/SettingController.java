package com.greenelegance.api.controller;

import com.greenelegance.api.service.SettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/settings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SettingController {

    private final SettingService settingService;

    @GetMapping
    public ResponseEntity<Map<String, String>> getSettings() {
        return ResponseEntity.ok(settingService.getSettingsAsMap());
    }
}
