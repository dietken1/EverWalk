package com.everwalk.service;

import com.everwalk.model.Video;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Slf4j
@Service
public class LumaService {

    private final WebClient webClient;
    private final String apiKey;

    public LumaService(
            WebClient.Builder webClientBuilder,
            @Value("${ai.luma.api-key}") String apiKey,
            @Value("${ai.luma.api-url}") String apiUrl
    ) {
        this.webClient = webClientBuilder
                .baseUrl(apiUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .build();
        this.apiKey = apiKey;
    }

    public String createVideoGeneration(
            String imageUrl,
            String aiDescription,
            Video.InteractionType interactionType
    ) {
        try {
            String prompt = buildPrompt(aiDescription, interactionType);

            log.info("Creating video with Luma for interaction: {}", interactionType);

            // TODO: 실제 Luma API 호출 구현
            // 여기서는 임시로 더미 Job ID 반환
            // Map<String, Object> request = Map.of(
            //     "image_url", imageUrl,
            //     "prompt", prompt,
            //     "duration", 5
            // );
            //
            // Map<String, Object> response = webClient.post()
            //     .uri("/generations")
            //     .bodyValue(request)
            //     .retrieve()
            //     .bodyToMono(Map.class)
            //     .block();
            //
            // return (String) response.get("id");

            return "luma-job-" + System.currentTimeMillis();

        } catch (Exception e) {
            log.error("Failed to create video generation", e);
            throw new RuntimeException("영상 생성 요청에 실패했습니다: " + e.getMessage());
        }
    }

    public Map<String, Object> getGenerationStatus(String jobId) {
        try {
            log.info("Checking status for job: {}", jobId);

            // TODO: 실제 Luma API 호출 구현
            // Map<String, Object> response = webClient.get()
            //     .uri("/generations/" + jobId)
            //     .retrieve()
            //     .bodyToMono(Map.class)
            //     .block();
            //
            // return response;

            // 임시 더미 데이터
            return Map.of(
                    "status", "completed",
                    "progress", 100,
                    "video_url", "https://example.com/videos/" + jobId + ".mp4"
            );

        } catch (Exception e) {
            log.error("Failed to get generation status", e);
            throw new RuntimeException("영상 생성 상태 조회에 실패했습니다: " + e.getMessage());
        }
    }

    private String buildPrompt(String aiDescription, Video.InteractionType interactionType) {
        String action = switch (interactionType) {
            case FEEDING -> "eating food from a bowl with happy, natural movements";
            case PETTING -> "being petted and showing affection, looking content";
            case PLAYING -> "playing with a toy energetically and joyfully";
            case WALKING -> "walking naturally with a gentle, relaxed gait";
        };

        return String.format(
                "A realistic video of %s, %s. High quality, natural motion, 5 seconds.",
                aiDescription, action
        );
    }
}
