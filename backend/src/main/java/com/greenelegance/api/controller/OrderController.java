package com.greenelegance.api.controller;

import com.greenelegance.api.dto.OrderCreationRequest;
import com.greenelegance.api.dto.OrderCreationResponse;
import com.greenelegance.api.entity.Order;
import com.greenelegance.api.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/upload-proof")
    public ResponseEntity<Map<String, String>> uploadProof(@RequestParam("file") MultipartFile file) {
        try {
            String path = orderService.uploadProof(file);
            Map<String, String> response = new HashMap<>();
            response.put("proofImagePath", path);
            return ResponseEntity.ok(response);
        } catch (IOException | IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderCreationRequest request) {
        try {
            OrderCreationResponse result = orderService.createOrder(request);
            Map<String, Object> response = new HashMap<>();
            response.put("order", result.getOrder());
            response.put("isNewUser", result.isNewUser());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/{orderCode}")
    public ResponseEntity<Order> getOrderByCode(@PathVariable String orderCode) {
        try {
            Order order = orderService.getOrderByCode(orderCode);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
