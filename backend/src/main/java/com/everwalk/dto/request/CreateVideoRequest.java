package com.everwalk.dto.request;

import com.everwalk.model.Video;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateVideoRequest {

    @NotNull(message = "인터랙션 타입은 필수입니다")
    private Video.InteractionType interactionType;
}
