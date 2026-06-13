package com.greenelegance.api.controller;

import com.greenelegance.api.entity.Favorite;
import com.greenelegance.api.entity.Product;
import com.greenelegance.api.entity.User;
import com.greenelegance.api.repository.FavoriteRepository;
import com.greenelegance.api.repository.ProductRepository;
import com.greenelegance.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/favorites")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FavoriteController {

    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            return userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }
        throw new RuntimeException("Unauthorized");
    }

    @GetMapping
    public ResponseEntity<List<Product>> getMyFavorites() {
        User user = getCurrentUser();
        List<Favorite> favorites = favoriteRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<Product> products = favorites.stream()
                .map(Favorite::getProduct)
                .collect(Collectors.toList());
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/ids")
    public ResponseEntity<List<Long>> getMyFavoriteIds() {
        User user = getCurrentUser();
        List<Favorite> favorites = favoriteRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<Long> ids = favorites.stream()
                .map(f -> f.getProduct().getId())
                .collect(Collectors.toList());
        return ResponseEntity.ok(ids);
    }

    @PostMapping("/{productId}")
    public ResponseEntity<?> addFavorite(@PathVariable Long productId) {
        User user = getCurrentUser();
        
        if (favoriteRepository.existsByUserIdAndProductId(user.getId(), productId)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Product is already in favorites"));
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Favorite favorite = Favorite.builder()
                .user(user)
                .product(product)
                .build();
        favoriteRepository.save(favorite);

        return ResponseEntity.ok(Map.of("message", "Added to favorites", "productId", productId));
    }

    @DeleteMapping("/{productId}")
    @Transactional
    public ResponseEntity<?> removeFavorite(@PathVariable Long productId) {
        User user = getCurrentUser();
        favoriteRepository.deleteByUserIdAndProductId(user.getId(), productId);
        return ResponseEntity.ok(Map.of("message", "Removed from favorites", "productId", productId));
    }
}
