package com.greenelegance.api.repository;

import com.greenelegance.api.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Favorite> findByUserIdAndProductId(Long userId, Long productId);
    boolean existsByUserIdAndProductId(Long userId, Long productId);
    void deleteByUserIdAndProductId(Long userId, Long productId);

    @org.springframework.data.jpa.repository.Query("SELECT f.product.id FROM Favorite f WHERE f.user.id = :userId ORDER BY f.createdAt DESC")
    List<Long> findProductIdsByUserId(@org.springframework.data.repository.query.Param("userId") Long userId);
}
