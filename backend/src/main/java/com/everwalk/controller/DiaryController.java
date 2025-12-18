package com.everwalk.controller;

import com.everwalk.dto.response.DiaryEntryResponse;
import com.everwalk.service.DiaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Diary", description = "비밀일기 API")
@RestController
@RequestMapping("/diaries")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
public class DiaryController {

    private final DiaryService diaryService;

    @Operation(summary = "일기 목록 조회", description = "반려동물의 비밀일기 목록을 조회합니다")
    @GetMapping("/pets/{petId}")
    public ResponseEntity<List<DiaryEntryResponse>> getDiaries(
            @PathVariable Long petId,
            Authentication authentication
    ) {
        Long userId = Long.parseLong(authentication.getName());
        List<DiaryEntryResponse> diaries = diaryService.getDiaries(userId, petId);
        return ResponseEntity.ok(diaries);
    }

    @Operation(summary = "일기 상세 조회", description = "특정 일기의 상세 내용을 조회합니다")
    @GetMapping("/{diaryId}")
    public ResponseEntity<DiaryEntryResponse> getDiary(
            @PathVariable Long diaryId,
            Authentication authentication
    ) {
        Long userId = Long.parseLong(authentication.getName());
        DiaryEntryResponse diary = diaryService.getDiary(userId, diaryId);
        return ResponseEntity.ok(diary);
    }

    @Operation(summary = "일기 생성 요청", description = "반려동물이 새로운 비밀일기를 작성합니다 (AI 생성)")
    @PostMapping("/pets/{petId}")
    public ResponseEntity<DiaryEntryResponse> createDiary(
            @PathVariable Long petId,
            Authentication authentication
    ) {
        Long userId = Long.parseLong(authentication.getName());
        DiaryEntryResponse diary = diaryService.createDiary(userId, petId);
        return ResponseEntity.ok(diary);
    }

    @Operation(summary = "읽음 처리", description = "일기를 읽음으로 표시합니다")
    @PutMapping("/{diaryId}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long diaryId,
            Authentication authentication
    ) {
        Long userId = Long.parseLong(authentication.getName());
        diaryService.markAsRead(userId, diaryId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "안 읽은 일기 수", description = "반려동물의 안 읽은 일기 개수를 조회합니다")
    @GetMapping("/pets/{petId}/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @PathVariable Long petId,
            Authentication authentication
    ) {
        Long userId = Long.parseLong(authentication.getName());
        Long count = diaryService.getUnreadCount(userId, petId);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }
}
