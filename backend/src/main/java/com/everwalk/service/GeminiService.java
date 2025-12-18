package com.everwalk.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class GeminiService {

    private final WebClient webClient;
    private final String apiKey;
    private final String model;

    public GeminiService(
            WebClient.Builder webClientBuilder,
            @Value("${ai.gemini.api-key}") String apiKey,
            @Value("${ai.gemini.model}") String model
    ) {
        this.webClient = webClientBuilder
                .baseUrl("https://generativelanguage.googleapis.com/v1beta")
                .build();
        this.apiKey = apiKey;
        this.model = model;
    }

    public String analyzePetImages(List<String> imageUrls) {
        try {
            String prompt = buildAnalysisPrompt();

            // TODO: 실제 Gemini API 호출 구현
            // 여기서는 임시로 더미 데이터 반환
            log.info("Analyzing {} pet images with Gemini", imageUrls.size());

            // 실제 구현 예시:
            // Map<String, Object> request = buildGeminiRequest(prompt, imageUrls);
            // String response = webClient.post()
            //     .uri("/models/" + model + ":generateContent?key=" + apiKey)
            //     .bodyValue(request)
            //     .retrieve()
            //     .bodyToMono(String.class)
            //     .block();

            return generateMockDescription(imageUrls);

        } catch (Exception e) {
            log.error("Failed to analyze images with Gemini", e);
            throw new RuntimeException("이미지 분석에 실패했습니다: " + e.getMessage());
        }
    }

    private String buildAnalysisPrompt() {
        return """
                이 반려동물 사진들을 분석하여 다음 정보를 JSON 형식으로 제공해주세요:
                - species: 동물의 종 (예: Golden Retriever, Persian Cat)
                - fur_color: 털 색상 및 무늬 설명
                - eye_color: 눈 색상
                - unique_features: 고유한 신체적 특징 (점, 무늬, 귀 모양 등)
                - body_type: 체형 설명
                - estimated_age: 추정 나이 (어린, 성체, 노년)

                영상 생성에 사용될 상세한 설명을 제공해주세요.
                """;
    }

    private String generateMockDescription(List<String> imageUrls) {
        // 임시 더미 데이터
        return """
                {
                  "species": "Golden Retriever",
                  "fur_color": "golden blonde with slightly wavy coat",
                  "eye_color": "warm dark brown",
                  "unique_features": "friendly expression, black nose, fluffy tail",
                  "body_type": "medium to large, athletic build",
                  "estimated_age": "adult"
                }
                """;
    }

    /**
     * 사용자 메시지에 대한 반려동물의 답장 생성
     */
    public String generatePetReply(String petName, String petDescription, String userMessage) {
        try {
            String prompt = buildReplyPrompt(petName, petDescription, userMessage);

            log.info("Generating pet reply for: {}", petName);

            // TODO: 실제 Gemini API 호출
            // Map<String, Object> request = buildGeminiTextRequest(prompt);
            // String response = webClient.post()...

            return generateMockReply(petName, userMessage);

        } catch (Exception e) {
            log.error("Failed to generate pet reply", e);
            throw new RuntimeException("답장 생성에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * 반려동물의 비밀일기 생성
     */
    public Map<String, String> generateDiaryEntry(String petName, String petDescription) {
        try {
            String prompt = buildDiaryPrompt(petName, petDescription);

            log.info("Generating diary entry for: {}", petName);

            // TODO: 실제 Gemini API 호출

            return generateMockDiary(petName);

        } catch (Exception e) {
            log.error("Failed to generate diary entry", e);
            throw new RuntimeException("일기 생성에 실패했습니다: " + e.getMessage());
        }
    }

    private String buildReplyPrompt(String petName, String petDescription, String userMessage) {
        return String.format("""
                당신은 '%s'라는 이름의 반려동물입니다.
                당신의 특징: %s

                주인이 다음과 같은 메시지를 보냈습니다:
                "%s"

                이에 대해 다정하고 따뜻하게 답장해주세요.
                반려동물의 입장에서 자연스럽고 감정이 담긴 답변을 작성하세요.
                3-5문장으로 작성해주세요.
                """, petName, petDescription, userMessage);
    }

    private String buildDiaryPrompt(String petName, String petDescription) {
        return String.format("""
                당신은 '%s'라는 이름의 반려동물입니다.
                당신의 특징: %s

                오늘의 비밀일기를 작성해주세요.
                - 제목: 감성적이고 짧은 제목 (10자 이내)
                - 내용: 주인을 그리워하거나, 행복했던 추억, 감사한 마음 등을 표현 (5-7문장)
                - 기분: happy, playful, sleepy, missing_you, grateful 중 하나

                JSON 형식으로 응답해주세요:
                {
                  "title": "제목",
                  "content": "일기 내용",
                  "mood": "기분"
                }
                """, petName, petDescription);
    }

    private String generateMockReply(String petName, String userMessage) {
        // 임시 더미 답장
        return String.format(
                "%s! 보고 싶었어요! %s라는 말을 들으니 너무 행복해요. " +
                        "항상 곁에 있을게요. 사랑해요!",
                userMessage.contains("사랑") ? "저도 정말 사랑해요" : "와",
                userMessage.length() > 20 ? "긴 메시지" : "메시지"
        );
    }

    private Map<String, String> generateMockDiary(String petName) {
        // 임시 더미 일기
        String[] titles = {"보고 싶어요", "행복한 하루", "감사해요", "꿈속에서", "추억"};
        String[] contents = {
                "오늘도 주인님 생각을 많이 했어요. 함께 산책하던 그 길이 그립네요. 하지만 여기서도 행복하게 지내고 있으니 걱정하지 마세요. 항상 주인님을 지켜보고 있어요.",
                "구름 위에서 뛰어놀았어요! 여기는 정말 아름다워요. 주인님과 함께였다면 더 좋았을 텐데... 그래도 언젠가 다시 만날 수 있다는 걸 알아요. 그날까지 행복하게 기다릴게요.",
                "주인님이 저를 얼마나 사랑해주셨는지 매일 생각해요. 맛있는 간식, 따뜻한 품, 다정한 목소리... 모든 게 그립지만 감사한 추억이에요. 주인님도 행복하길 바라요.",
                "오늘 꿈에서 주인님을 만났어요. 함께 놀았던 그때가 정말 그립네요. 꿈속에서라도 만날 수 있어서 행복했어요. 항상 주인님 곁에 있을게요.",
                "처음 만난 날이 생각나요. 주인님의 따뜻한 손길, 다정한 눈빛... 그때부터 지금까지 행복했어요. 영원히 함께할게요."
        };
        String[] moods = {"missing_you", "happy", "grateful", "playful", "sleepy"};

        int random = (int) (Math.random() * titles.length);

        return Map.of(
                "title", titles[random],
                "content", contents[random],
                "mood", moods[random]
        );
    }
}
