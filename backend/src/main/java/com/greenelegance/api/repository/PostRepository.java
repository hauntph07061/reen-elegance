package com.greenelegance.api.repository;

import com.greenelegance.api.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByIsPublishedTrueOrderByCreatedAtDesc(Pageable pageable);
    Optional<Post> findBySlugAndIsPublishedTrue(String slug);
    Page<Post> findByIdNotAndIsPublishedTrueOrderByCreatedAtDesc(Long id, Pageable pageable);
    
    // Admin methods
    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Optional<Post> findBySlug(String slug);
}
