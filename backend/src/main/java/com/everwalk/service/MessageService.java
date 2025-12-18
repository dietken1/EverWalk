package com.everwalk.service;

import com.everwalk.dto.request.SendMessageRequest;
import com.everwalk.dto.response.MessageResponse;
import com.everwalk.exception.ResourceNotFoundException;
import com.everwalk.model.Message;
import com.everwalk.model.Pet;
import com.everwalk.repository.MessageRepository;
import com.everwalk.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final PetRepository petRepository;
    private final GeminiService geminiService;

    @Transactional(readOnly = true)
    public List<MessageResponse> getMessages(Long userId, Long petId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("반려동물을 찾을 수 없습니다"));

        if (!pet.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("반려동물을 찾을 수 없습니다");
        }

        List<Message> messages = messageRepository.findByPetIdOrderByCreatedAtAsc(petId);
        return messages.stream()
                .map(MessageResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public MessageResponse sendMessage(Long userId, Long petId, SendMessageRequest request) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("반려동물을 찾을 수 없습니다"));

        if (!pet.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("반려동물을 찾을 수 없습니다");
        }

        // 사용자 메시지 저장
        Message userMessage = Message.builder()
                .pet(pet)
                .senderType(Message.SenderType.USER)
                .content(request.getContent())
                .isRead(true)
                .build();

        userMessage = messageRepository.save(userMessage);
        log.info("User message saved for pet: {}", pet.getName());

        // 비동기로 반려동물 답장 생성
        generatePetReply(pet, request.getContent());

        return MessageResponse.from(userMessage);
    }

    @Async
    @Transactional
    public void generatePetReply(Pet pet, String userMessage) {
        try {
            // AI로 답장 생성
            String replyContent = geminiService.generatePetReply(
                    pet.getName(),
                    pet.getAiDescription(),
                    userMessage
            );

            // 답장 저장
            Message petReply = Message.builder()
                    .pet(pet)
                    .senderType(Message.SenderType.PET)
                    .content(replyContent)
                    .isRead(false)
                    .build();

            messageRepository.save(petReply);
            log.info("Pet reply generated for: {}", pet.getName());

        } catch (Exception e) {
            log.error("Failed to generate pet reply", e);
        }
    }

    @Transactional
    public void markAsRead(Long userId, Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("메시지를 찾을 수 없습니다"));

        if (!message.getPet().getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("메시지를 찾을 수 없습니다");
        }

        message.setIsRead(true);
        messageRepository.save(message);
    }

    @Transactional(readOnly = true)
    public Long getUnreadCount(Long userId, Long petId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("반려동물을 찾을 수 없습니다"));

        if (!pet.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("반려동물을 찾을 수 없습니다");
        }

        return messageRepository.countByPetIdAndIsReadFalse(petId);
    }
}
