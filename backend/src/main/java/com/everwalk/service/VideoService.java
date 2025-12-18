package com.everwalk.service;

import com.everwalk.dto.request.CreateVideoRequest;
import com.everwalk.dto.response.VideoResponse;
import com.everwalk.exception.ResourceNotFoundException;
import com.everwalk.model.Pet;
import com.everwalk.model.Video;
import com.everwalk.model.VideoJob;
import com.everwalk.repository.PetRepository;
import com.everwalk.repository.VideoJobRepository;
import com.everwalk.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class VideoService {

    private final VideoRepository videoRepository;
    private final PetRepository petRepository;
    private final VideoJobRepository videoJobRepository;
    private final LumaService lumaService;

    @Transactional
    public VideoJob createVideo(Long userId, Long petId, CreateVideoRequest request) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("반려동물을 찾을 수 없습니다"));

        if (!pet.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("반려동물을 찾을 수 없습니다");
        }

        // VideoJob 생성
        VideoJob job = VideoJob.builder()
                .pet(pet)
                .interactionType(request.getInteractionType())
                .status(VideoJob.JobStatus.PENDING)
                .progressPercent(0)
                .build();

        job = videoJobRepository.save(job);
        log.info("Video job created: {} for pet: {}", job.getId(), pet.getName());

        // 비동기로 영상 생성 시작
        processVideoGeneration(job.getId(), pet, request.getInteractionType());

        return job;
    }

    @Async
    @Transactional
    public void processVideoGeneration(Long jobId, Pet pet, Video.InteractionType interactionType) {
        VideoJob job = videoJobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("작업을 찾을 수 없습니다"));

        try {
            // 상태 업데이트: PROCESSING
            job.setStatus(VideoJob.JobStatus.PROCESSING);
            job.setProgressPercent(10);
            videoJobRepository.save(job);

            // Luma API로 영상 생성 요청
            String lumaJobId = lumaService.createVideoGeneration(
                    pet.getPrimaryImageUrl(),
                    pet.getAiDescription(),
                    interactionType
            );

            job.setLumaJobId(lumaJobId);
            job.setProgressPercent(30);
            videoJobRepository.save(job);

            // 폴링으로 상태 확인 (실제로는 웹훅 사용 권장)
            pollGenerationStatus(job);

        } catch (Exception e) {
            log.error("Video generation failed for job: {}", jobId, e);
            job.setStatus(VideoJob.JobStatus.FAILED);
            job.setErrorMessage(e.getMessage());
            job.setCompletedAt(LocalDateTime.now());
            videoJobRepository.save(job);
        }
    }

    private void pollGenerationStatus(VideoJob job) {
        int maxAttempts = 60; // 최대 5분 (5초 * 60)
        int attempt = 0;

        while (attempt < maxAttempts) {
            try {
                Thread.sleep(5000); // 5초 대기

                Map<String, Object> status = lumaService.getGenerationStatus(job.getLumaJobId());
                String statusStr = (String) status.get("status");
                Integer progress = (Integer) status.getOrDefault("progress", 0);

                job.setProgressPercent(30 + (progress * 70 / 100));
                videoJobRepository.save(job);

                if ("completed".equals(statusStr)) {
                    // 영상 완료
                    String videoUrl = (String) status.get("video_url");
                    saveCompletedVideo(job, videoUrl);
                    return;
                } else if ("failed".equals(statusStr)) {
                    throw new RuntimeException("영상 생성 실패");
                }

                attempt++;

            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("작업이 중단되었습니다");
            }
        }

        throw new RuntimeException("영상 생성 시간 초과");
    }

    @Transactional
    private void saveCompletedVideo(VideoJob job, String videoUrl) {
        Video video = Video.builder()
                .pet(job.getPet())
                .interactionType(job.getInteractionType())
                .videoUrl(videoUrl)
                .durationSeconds(5)
                .lumaJobId(job.getLumaJobId())
                .build();

        videoRepository.save(video);

        job.setStatus(VideoJob.JobStatus.COMPLETED);
        job.setProgressPercent(100);
        job.setCompletedAt(LocalDateTime.now());
        videoJobRepository.save(job);

        log.info("Video completed and saved: {}", video.getId());
    }

    @Transactional(readOnly = true)
    public List<VideoResponse> getPetVideos(Long userId, Long petId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("반려동물을 찾을 수 없습니다"));

        if (!pet.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("반려동물을 찾을 수 없습니다");
        }

        List<Video> videos = videoRepository.findByPetIdOrderByCreatedAtDesc(petId);
        return videos.stream()
                .map(VideoResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public VideoJob getJobStatus(Long jobId) {
        return videoJobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("작업을 찾을 수 없습니다"));
    }
}
