package com.greenelegance.api.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PostDto {
    private Long id;
    private String title;
    private String slug;
    private String summary;
    private String content;
    private String thumbnailUrl;
    private Boolean isPublished;
    private LocalDateTime createdAt;
}
