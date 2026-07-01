package com.greenelegance.api.service;

import com.greenelegance.api.entity.Favorite;
import com.greenelegance.api.entity.Product;
import com.greenelegance.api.entity.User;
import com.greenelegance.api.repository.FavoriteRepository;
import com.greenelegance.api.repository.ProductRepository;
import com.greenelegance.api.util.MessageConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<Favorite> getFavorites(User user) {
        return favoriteRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    @Transactional(readOnly = true)
    public List<Long> getFavoriteIds(User user) {
        return favoriteRepository.findProductIdsByUserId(user.getId());
    }

    @Transactional
    public void addFavorite(User user, Long productId) {
        if (favoriteRepository.existsByUserIdAndProductId(user.getId(), productId)) {
            throw new IllegalArgumentException(MessageConstants.PRODUCT_ALREADY_FAVORITE);
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException(MessageConstants.PRODUCT_NOT_FOUND));

        Favorite favorite = Favorite.builder()
                .user(user)
                .product(product)
                .build();
        favoriteRepository.save(favorite);
    }

    @Transactional
    public void removeFavorite(User user, Long productId) {
        favoriteRepository.deleteByUserIdAndProductId(user.getId(), productId);
    }
}
