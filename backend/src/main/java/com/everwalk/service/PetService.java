package com.everwalk.service;

import com.everwalk.dto.request.CreatePetRequest;
import com.everwalk.dto.response.PetResponse;
import com.everwalk.exception.ResourceNotFoundException;
import com.everwalk.model.Pet;
import com.everwalk.model.PetImage;
import com.everwalk.model.User;
import com.everwalk.repository.PetRepository;
import com.everwalk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final GeminiService geminiService;

    @Transactional
    public PetResponse createPet(Long userId, CreatePetRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다"));

        // Pet 생성
        Pet pet = Pet.builder()
                .user(user)
                .name(request.getName())
                .species(request.getSpecies())
                .memorialDate(request.getMemorialDate())
                .isActive(true)
                .build();

        // 이미지 추가
        List<PetImage> images = request.getImageUrls().stream()
                .map(url -> PetImage.builder()
                        .pet(pet)
                        .imageUrl(url)
                        .isPrimary(false)
                        .build())
                .collect(Collectors.toList());

        if (!images.isEmpty()) {
            images.get(0).setIsPrimary(true);
            pet.setPrimaryImageUrl(images.get(0).getImageUrl());
        }

        pet.setImages(images);

        // Gemini로 AI 특징 분석 (비동기로 처리 가능)
        try {
            String aiDescription = geminiService.analyzePetImages(request.getImageUrls());
            pet.setAiDescription(aiDescription);
            log.info("AI description generated for pet: {}", pet.getName());
        } catch (Exception e) {
            log.error("Failed to generate AI description", e);
            pet.setAiDescription("AI 분석 실패: " + e.getMessage());
        }

        pet = petRepository.save(pet);
        log.info("New pet created: {} for user: {}", pet.getName(), user.getEmail());

        return PetResponse.from(pet);
    }

    @Transactional(readOnly = true)
    public List<PetResponse> getUserPets(Long userId) {
        List<Pet> pets = petRepository.findByUserIdAndIsActiveTrue(userId);
        return pets.stream()
                .map(PetResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PetResponse getPet(Long userId, Long petId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("반려동물을 찾을 수 없습니다"));

        if (!pet.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("반려동물을 찾을 수 없습니다");
        }

        return PetResponse.from(pet);
    }

    @Transactional
    public void deletePet(Long userId, Long petId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("반려동물을 찾을 수 없습니다"));

        if (!pet.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("반려동물을 찾을 수 없습니다");
        }

        pet.setIsActive(false);
        petRepository.save(pet);
        log.info("Pet deactivated: {} for user: {}", pet.getName(), pet.getUser().getEmail());
    }
}
