package com.greenelegance.api.controller;

import com.greenelegance.api.entity.Order;
import com.greenelegance.api.entity.PointsLedger;
import com.greenelegance.api.entity.User;
import com.greenelegance.api.repository.OrderRepository;
import com.greenelegance.api.repository.PointsLedgerRepository;
import com.greenelegance.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/loyalty")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LoyaltyController {

    private final PointsLedgerRepository pointsLedgerRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            return userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }
        throw new RuntimeException("Unauthorized");
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getMyPoints() {
        User user = getCurrentUser();
        Map<String, Object> response = new HashMap<>();
        response.put("loyaltyPoints", user.getLoyaltyPoints());
        
        // Xác định thứ hạng
        String rank = "Đồng";
        if (user.getLoyaltyPoints() >= 1000) rank = "Vàng";
        else if (user.getLoyaltyPoints() >= 300) rank = "Bạc";
        response.put("rank", rank);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<PointsLedger>> getMyHistory() {
        User user = getCurrentUser();
        return ResponseEntity.ok(pointsLedgerRepository.findByUserIdOrderByCreatedAtDesc(user.getId()));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders() {
        User user = getCurrentUser();
        return ResponseEntity.ok(orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()));
    }
}
