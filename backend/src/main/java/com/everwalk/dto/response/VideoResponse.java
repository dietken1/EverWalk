package com.everwalk.dto.response;

import com.everwalk.model.Video;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VideoResponse {
    private Long id;
    private Long petId;
    private String petName;
    private Video.InteractionType interactionType;
    private String videoUrl;
    private String thumbnailUrl;
    private Integer durationSeconds;
    private LocalDateTime createdAt;

    public static VideoResponse from(Video video) {
        return VideoResponse.builder()
                .id(video.getId())
                .petId(video.getPet().getId())
                .petName(video.getPet().getName())
                .interactionType(video.getInteractionType())
                .videoUrl(video.getVideoUrl())
                .thumbnailUrl(video.getThumbnailUrl())
                .durationSeconds(video.getDurationSeconds())
                .createdAt(video.getCreatedAt())
                .build();
    }
}
