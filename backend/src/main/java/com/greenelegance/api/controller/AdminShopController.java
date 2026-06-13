package com.greenelegance.api.controller;

import com.greenelegance.api.entity.Shop;
import com.greenelegance.api.repository.ShopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/shops")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
public class AdminShopController {

    private final ShopRepository shopRepository;

    @GetMapping
    public ResponseEntity<List<Shop>> getAllShops() {
        return ResponseEntity.ok(shopRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Shop> createShop(@RequestBody Shop shopRequest) {
        Shop shop = new Shop();
        shop.setName(shopRequest.getName());
        shop.setAddress(shopRequest.getAddress());
        shop.setPhone(shopRequest.getPhone());
        shop.setMapIframe(shopRequest.getMapIframe());
        
        return ResponseEntity.ok(shopRepository.save(shop));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Shop> updateShop(@PathVariable Long id, @RequestBody Shop shopRequest) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shop not found with id: " + id));
        
        shop.setName(shopRequest.getName());
        shop.setAddress(shopRequest.getAddress());
        shop.setPhone(shopRequest.getPhone());
        shop.setMapIframe(shopRequest.getMapIframe());
        
        return ResponseEntity.ok(shopRepository.save(shop));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShop(@PathVariable Long id) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shop not found with id: " + id));
        
        shopRepository.delete(shop);
        return ResponseEntity.ok().build();
    }
}
