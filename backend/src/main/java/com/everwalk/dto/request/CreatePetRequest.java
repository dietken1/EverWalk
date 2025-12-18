package com.everwalk.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class CreatePetRequest {

    @NotBlank(message = "반려동물 이름은 필수입니다")
    private String name;

    @NotEmpty(message = "최소 1장의 사진이 필요합니다")
    private List<String> imageUrls;

    private String species;

    private LocalDate memorialDate;
}
