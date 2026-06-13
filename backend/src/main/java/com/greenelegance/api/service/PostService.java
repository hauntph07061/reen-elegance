package com.greenelegance.api.service;

import com.greenelegance.api.dto.PostDto;
import com.greenelegance.api.entity.Post;
import com.greenelegance.api.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    public Page<PostDto> getPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return postRepository.findByIsPublishedTrueOrderByCreatedAtDesc(pageable)
                .map(this::mapToDto);
    }

    public PostDto getPostBySlug(String slug) {
        Post post = postRepository.findBySlugAndIsPublishedTrue(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy bài viết"));
        return mapToDto(post);
    }

    public List<PostDto> getRelatedPosts(String currentSlug, int limit) {
        Post currentPost = postRepository.findBySlugAndIsPublishedTrue(currentSlug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy bài viết"));
        
        Pageable pageable = PageRequest.of(0, limit);
        return postRepository.findByIdNotAndIsPublishedTrueOrderByCreatedAtDesc(currentPost.getId(), pageable)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // --- ADMIN METHODS ---

    public Page<PostDto> getAdminPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return postRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::mapToDto);
    }

    public PostDto getAdminPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy bài viết"));
        return mapToDto(post);
    }

    public PostDto createPost(PostDto dto) {
        if (postRepository.findBySlug(dto.getSlug()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Slug đã tồn tại");
        }
        Post post = Post.builder()
                .title(dto.getTitle())
                .slug(dto.getSlug())
                .summary(dto.getSummary())
                .content(dto.getContent())
                .thumbnailUrl(dto.getThumbnailUrl())
                .isPublished(dto.getIsPublished() != null ? dto.getIsPublished() : true)
                .build();
        return mapToDto(postRepository.save(post));
    }

    public PostDto updatePost(Long id, PostDto dto) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy bài viết"));
        
        if (!post.getSlug().equals(dto.getSlug()) && postRepository.findBySlug(dto.getSlug()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Slug đã tồn tại");
        }

        post.setTitle(dto.getTitle());
        post.setSlug(dto.getSlug());
        post.setSummary(dto.getSummary());
        post.setContent(dto.getContent());
        post.setThumbnailUrl(dto.getThumbnailUrl());
        if (dto.getIsPublished() != null) {
            post.setIsPublished(dto.getIsPublished());
        }

        return mapToDto(postRepository.save(post));
    }

    public void deletePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy bài viết"));
        postRepository.delete(post);
    }

    private PostDto mapToDto(Post post) {
        return PostDto.builder()
                .id(post.getId())
                .title(post.getTitle())
                .slug(post.getSlug())
                .summary(post.getSummary())
                .content(post.getContent())
                .thumbnailUrl(post.getThumbnailUrl())
                .isPublished(post.getIsPublished())
                .createdAt(post.getCreatedAt())
                .build();
    }
}
