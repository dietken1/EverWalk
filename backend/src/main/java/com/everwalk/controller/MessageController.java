package com.everwalk.controller;

import com.everwalk.dto.request.SendMessageRequest;
import com.everwalk.dto.response.MessageResponse;
import com.everwalk.service.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Message", description = "메시지 API")
@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
public class MessageController {

    private final MessageService messageService;

    @Operation(summary = "메시지 목록 조회", description = "반려동물과의 메시지 대화 내역을 조회합니다")
    @GetMapping("/pets/{petId}")
    public ResponseEntity<List<MessageResponse>> getMessages(
            @PathVariable Long petId,
            Authentication authentication
    ) {
        Long userId = Long.parseLong(authentication.getName());
        List<MessageResponse> messages = messageService.getMessages(userId, petId);
        return ResponseEntity.ok(messages);
    }

    @Operation(summary = "메시지 보내기", description = "반려동물에게 메시지를 보냅니다 (AI가 자동으로 답장합니다)")
    @PostMapping("/pets/{petId}")
    public ResponseEntity<MessageResponse> sendMessage(
            @PathVariable Long petId,
            @Valid @RequestBody SendMessageRequest request,
            Authentication authentication
    ) {
        Long userId = Long.parseLong(authentication.getName());
        MessageResponse response = messageService.sendMessage(userId, petId, request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "읽음 처리", description = "메시지를 읽음으로 표시합니다")
    @PutMapping("/{messageId}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long messageId,
            Authentication authentication
    ) {
        Long userId = Long.parseLong(authentication.getName());
        messageService.markAsRead(userId, messageId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "안 읽은 메시지 수", description = "반려동물의 안 읽은 메시지 개수를 조회합니다")
    @GetMapping("/pets/{petId}/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @PathVariable Long petId,
            Authentication authentication
    ) {
        Long userId = Long.parseLong(authentication.getName());
        Long count = messageService.getUnreadCount(userId, petId);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }
}
