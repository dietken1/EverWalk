package com.everwalk.dto.response;

import com.everwalk.model.DiaryEntry;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiaryEntryResponse {
    private Long id;
    private Long petId;
    private String petName;
    private String title;
    private String content;
    private String mood;
    private Boolean isRead;
    private LocalDateTime createdAt;

    public static DiaryEntryResponse from(DiaryEntry entry) {
        return DiaryEntryResponse.builder()
                .id(entry.getId())
                .petId(entry.getPet().getId())
                .petName(entry.getPet().getName())
                .title(entry.getTitle())
                .content(entry.getContent())
                .mood(entry.getMood() != null ? entry.getMood().name() : null)
                .isRead(entry.getIsRead())
                .createdAt(entry.getCreatedAt())
                .build();
    }
}
