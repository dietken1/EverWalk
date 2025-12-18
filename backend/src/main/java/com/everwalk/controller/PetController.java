package com.everwalk.controller;

import com.everwalk.dto.request.CreatePetRequest;
import com.everwalk.dto.response.PetResponse;
import com.everwalk.service.PetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Pet", description = "반려동물 API")
@RestController
@RequestMapping("/pets")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
public class PetController {

    private final PetService petService;

    @Operation(summary = "반려동물 등록", description = "새로운 반려동물을 등록합니다")
    @PostMapping
    public ResponseEntity<PetResponse> createPet(
            @Valid @RequestBody CreatePetRequest request,
            Authentication authentication
    ) {
        Long userId = Long.parseLong(authentication.getName());
        PetResponse response = petService.createPet(userId, request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "내 반려동물 목록", description = "사용자의 반려동물 목록을 조회합니다")
    @GetMapping
    public ResponseEntity<List<PetResponse>> getUserPets(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        List<PetResponse> response = petService.getUserPets(userId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "반려동물 상세", description = "특정 반려동물의 상세 정보를 조회합니다")
    @GetMapping("/{petId}")
    public ResponseEntity<PetResponse> getPet(
            @PathVariable Long petId,
            Authentication authentication
    ) {
        Long userId = Long.parseLong(authentication.getName());
        PetResponse response = petService.getPet(userId, petId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "반려동물 삭제", description = "반려동물을 삭제합니다 (비활성화)")
    @DeleteMapping("/{petId}")
    public ResponseEntity<Void> deletePet(
            @PathVariable Long petId,
            Authentication authentication
    ) {
        Long userId = Long.parseLong(authentication.getName());
        petService.deletePet(userId, petId);
        return ResponseEntity.noContent().build();
    }
}
