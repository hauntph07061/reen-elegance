package com.greenelegance.api.controller;

import com.greenelegance.api.entity.Shop;
import com.greenelegance.api.repository.ShopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shops")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ShopController {

    private final ShopRepository shopRepository;

    @GetMapping
    public ResponseEntity<List<Shop>> getAllShops() {
        return ResponseEntity.ok(shopRepository.findAll());
    }
}
