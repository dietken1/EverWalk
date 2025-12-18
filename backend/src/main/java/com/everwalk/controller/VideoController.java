package com.everwalk.controller;

import com.everwalk.dto.request.CreateVideoRequest;
import com.everwalk.dto.response.VideoResponse;
import com.everwalk.model.VideoJob;
import com.everwalk.service.VideoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Tag(name = "Video", description = "영상 API")
@RestController
@RequestMapping("/videos")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
public class VideoController {

    private final VideoService videoService;
    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

    @Operation(summary = "영상 생성 요청", description = "반려동물 인터랙션 영상을 생성합니다")
    @PostMapping("/pets/{petId}")
    public ResponseEntity<VideoJob> createVideo(
            @PathVariable Long petId,
            @Valid @RequestBody CreateVideoRequest request,
            Authentication authentication
    ) {
        Long userId = Long.parseLong(authentication.getName());
        VideoJob job = videoService.createVideo(userId, petId, request);
        return ResponseEntity.ok(job);
    }

    @Operation(summary = "반려동물 영상 목록", description = "특정 반려동물의 영상 목록을 조회합니다")
    @GetMapping("/pets/{petId}")
    public ResponseEntity<List<VideoResponse>> getPetVideos(
            @PathVariable Long petId,
            Authentication authentication
    ) {
        Long userId = Long.parseLong(authentication.getName());
        List<VideoResponse> response = videoService.getPetVideos(userId, petId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "작업 상태 조회", description = "영상 생성 작업의 상태를 조회합니다")
    @GetMapping("/jobs/{jobId}")
    public ResponseEntity<VideoJob> getJobStatus(@PathVariable Long jobId) {
        VideoJob job = videoService.getJobStatus(jobId);
        return ResponseEntity.ok(job);
    }

    @Operation(summary = "작업 진행 상황 스트리밍", description = "SSE로 영상 생성 진행 상황을 실시간으로 받습니다")
    @GetMapping(value = "/jobs/{jobId}/progress", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamProgress(@PathVariable Long jobId) {
        SseEmitter emitter = new SseEmitter(300000L); // 5분 타임아웃

        emitters.put(jobId, emitter);

        emitter.onCompletion(() -> emitters.remove(jobId));
        emitter.onTimeout(() -> emitters.remove(jobId));
        emitter.onError((e) -> emitters.remove(jobId));

        // 별도 스레드에서 상태 폴링
        new Thread(() -> pollJobStatus(jobId, emitter)).start();

        return emitter;
    }

    private void pollJobStatus(Long jobId, SseEmitter emitter) {
        try {
            while (true) {
                VideoJob job = videoService.getJobStatus(jobId);

                // SSE 이벤트 전송
                emitter.send(SseEmitter.event()
                        .name("progress")
                        .data(Map.of(
                                "status", job.getStatus(),
                                "percent", job.getProgressPercent(),
                                "message", getStatusMessage(job)
                        )));

                if (job.getStatus() == VideoJob.JobStatus.COMPLETED ||
                        job.getStatus() == VideoJob.JobStatus.FAILED) {
                    emitter.complete();
                    break;
                }

                Thread.sleep(2000); // 2초마다 업데이트
            }
        } catch (IOException | InterruptedException e) {
            emitter.completeWithError(e);
        }
    }

    private String getStatusMessage(VideoJob job) {
        return switch (job.getStatus()) {
            case PENDING -> "영상 생성 준비 중...";
            case PROCESSING -> String.format("영상 생성 중... %d%%", job.getProgressPercent());
            case COMPLETED -> "영상 생성 완료!";
            case FAILED -> "영상 생성 실패: " + job.getErrorMessage();
        };
    }
}
