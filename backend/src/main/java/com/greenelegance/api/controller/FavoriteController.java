package com.greenelegance.api.controller;

import com.greenelegance.api.entity.Favorite;
import com.greenelegance.api.entity.Product;
import com.greenelegance.api.entity.User;
import com.greenelegance.api.repository.UserRepository;
import com.greenelegance.api.service.FavoriteService;
import com.greenelegance.api.util.MessageConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/favorites")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FavoriteController {

    private final FavoriteService favoriteService;
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
        List<Favorite> favorites = favoriteService.getFavorites(user);
        List<Product> products = favorites.stream()
                .map(Favorite::getProduct)
                .collect(Collectors.toList());
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/ids")
    public ResponseEntity<List<Long>> getMyFavoriteIds() {
        User user = getCurrentUser();
        return ResponseEntity.ok(favoriteService.getFavoriteIds(user));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<?> addFavorite(@PathVariable Long productId) {
        User user = getCurrentUser();
        favoriteService.addFavorite(user, productId);
        return ResponseEntity.ok(Map.of("message", MessageConstants.FAVORITE_ADDED, "productId", productId));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFavorite(@PathVariable Long productId) {
        User user = getCurrentUser();
        favoriteService.removeFavorite(user, productId);
        return ResponseEntity.ok(Map.of("message", MessageConstants.FAVORITE_REMOVED, "productId", productId));
    }
}
