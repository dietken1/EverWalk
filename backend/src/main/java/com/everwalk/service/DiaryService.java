package com.everwalk.service;

import com.everwalk.dto.response.DiaryEntryResponse;
import com.everwalk.exception.ResourceNotFoundException;
import com.everwalk.model.DiaryEntry;
import com.everwalk.model.Pet;
import com.everwalk.repository.DiaryEntryRepository;
import com.everwalk.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DiaryService {

    private final DiaryEntryRepository diaryEntryRepository;
    private final PetRepository petRepository;
    private final GeminiService geminiService;

    @Transactional(readOnly = true)
    public List<DiaryEntryResponse> getDiaries(Long userId, Long petId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("반려동물을 찾을 수 없습니다"));

        if (!pet.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("반려동물을 찾을 수 없습니다");
        }

        List<DiaryEntry> entries = diaryEntryRepository.findByPetIdOrderByCreatedAtDesc(petId);
        return entries.stream()
                .map(DiaryEntryResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DiaryEntryResponse getDiary(Long userId, Long diaryId) {
        DiaryEntry entry = diaryEntryRepository.findById(diaryId)
                .orElseThrow(() -> new ResourceNotFoundException("일기를 찾을 수 없습니다"));

        if (!entry.getPet().getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("일기를 찾을 수 없습니다");
        }

        return DiaryEntryResponse.from(entry);
    }

    @Transactional
    public DiaryEntryResponse createDiary(Long userId, Long petId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("반려동물을 찾을 수 없습니다"));

        if (!pet.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("반려동물을 찾을 수 없습니다");
        }

        // AI로 일기 생성
        Map<String, String> diaryData = geminiService.generateDiaryEntry(
                pet.getName(),
                pet.getAiDescription()
        );

        DiaryEntry entry = DiaryEntry.builder()
                .pet(pet)
                .title(diaryData.get("title"))
                .content(diaryData.get("content"))
                .mood(DiaryEntry.Mood.valueOf(diaryData.get("mood").toUpperCase()))
                .isRead(false)
                .build();

        entry = diaryEntryRepository.save(entry);
        log.info("Diary entry created for pet: {}", pet.getName());

        return DiaryEntryResponse.from(entry);
    }

    @Transactional
    public void markAsRead(Long userId, Long diaryId) {
        DiaryEntry entry = diaryEntryRepository.findById(diaryId)
                .orElseThrow(() -> new ResourceNotFoundException("일기를 찾을 수 없습니다"));

        if (!entry.getPet().getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("일기를 찾을 수 없습니다");
        }

        entry.setIsRead(true);
        diaryEntryRepository.save(entry);
    }

    @Transactional(readOnly = true)
    public Long getUnreadCount(Long userId, Long petId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("반려동물을 찾을 수 없습니다"));

        if (!pet.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("반려동물을 찾을 수 없습니다");
        }

        return diaryEntryRepository.countByPetIdAndIsReadFalse(petId);
    }

    /**
     * 매일 자정에 활성화된 모든 반려동물의 일기 자동 생성 (선택사항)
     */
    @Scheduled(cron = "0 0 0 * * *") // 매일 자정
    @Transactional
    public void generateDailyDiaries() {
        log.info("Starting daily diary generation...");

        List<Pet> activePets = petRepository.findAll().stream()
                .filter(Pet::getIsActive)
                .toList();

        for (Pet pet : activePets) {
            try {
                Map<String, String> diaryData = geminiService.generateDiaryEntry(
                        pet.getName(),
                        pet.getAiDescription()
                );

                DiaryEntry entry = DiaryEntry.builder()
                        .pet(pet)
                        .title(diaryData.get("title"))
                        .content(diaryData.get("content"))
                        .mood(DiaryEntry.Mood.valueOf(diaryData.get("mood").toUpperCase()))
                        .isRead(false)
                        .build();

                diaryEntryRepository.save(entry);
                log.info("Daily diary created for: {}", pet.getName());

            } catch (Exception e) {
                log.error("Failed to create daily diary for pet: {}", pet.getName(), e);
            }
        }

        log.info("Daily diary generation completed");
    }
}
