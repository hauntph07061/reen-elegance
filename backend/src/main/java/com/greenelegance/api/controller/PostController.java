package com.greenelegance.api.controller;

import com.greenelegance.api.dto.PostDto;
import com.greenelegance.api.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow frontend to call
public class PostController {

    private final PostService postService;

    @GetMapping
    public ResponseEntity<Page<PostDto>> getPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {
        return ResponseEntity.ok(postService.getPosts(page, size));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<PostDto> getPostBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(postService.getPostBySlug(slug));
    }

    @GetMapping("/{slug}/related")
    public ResponseEntity<List<PostDto>> getRelatedPosts(
            @PathVariable String slug,
            @RequestParam(defaultValue = "3") int limit) {
        return ResponseEntity.ok(postService.getRelatedPosts(slug, limit));
    }
}
