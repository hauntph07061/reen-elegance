package com.greenelegance.api.service;

import com.greenelegance.api.entity.Setting;
import com.greenelegance.api.repository.SettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SettingService {

    private final SettingRepository settingRepository;

    public List<Setting> getAllSettings() {
        return settingRepository.findAll();
    }

    public Map<String, String> getSettingsAsMap() {
        return settingRepository.findAll().stream()
                .collect(Collectors.toMap(Setting::getSettingKey, Setting::getSettingValue));
    }

    public void updateSettings(Map<String, String> updates) {
        updates.forEach((key, value) -> {
            Setting setting = settingRepository.findBySettingKey(key).orElse(new Setting());
            setting.setSettingKey(key);
            setting.setSettingValue(value);
            settingRepository.save(setting);
        });
    }
}
