package com.everwalk.dto.response;

import com.everwalk.model.Pet;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PetResponse {
    private Long id;
    private String name;
    private String species;
    private String aiDescription;
    private String primaryImageUrl;
    private Boolean isActive;
    private LocalDate memorialDate;
    private List<String> imageUrls;
    private LocalDateTime createdAt;

    public static PetResponse from(Pet pet) {
        return PetResponse.builder()
                .id(pet.getId())
                .name(pet.getName())
                .species(pet.getSpecies())
                .aiDescription(pet.getAiDescription())
                .primaryImageUrl(pet.getPrimaryImageUrl())
                .isActive(pet.getIsActive())
                .memorialDate(pet.getMemorialDate())
                .imageUrls(pet.getImages().stream()
                        .map(img -> img.getImageUrl())
                        .collect(Collectors.toList()))
                .createdAt(pet.getCreatedAt())
                .build();
    }
}
