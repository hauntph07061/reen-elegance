package com.greenelegance.api.controller;

import com.greenelegance.api.dto.PostDto;
import com.greenelegance.api.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/posts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow frontend to call
public class AdminPostController {

    private final PostService postService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<PostDto>> getAdminPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(postService.getAdminPosts(page, size));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PostDto> getAdminPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getAdminPostById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PostDto> createPost(@RequestBody PostDto dto) {
        return ResponseEntity.ok(postService.createPost(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PostDto> updatePost(@PathVariable Long id, @RequestBody PostDto dto) {
        return ResponseEntity.ok(postService.updatePost(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}
