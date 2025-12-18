package com.everwalk.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SendMessageRequest {

    @NotBlank(message = "메시지 내용은 필수입니다")
    private String content;
}
