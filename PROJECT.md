📝 프로젝트명: EverWalk
"추억 속 반려동물과 영원히 함께 걷는 시간"

## 1. 프로젝트 개요 (Vision)
무지개다리를 건넌 반려동물의 사진을 기반으로, 사용자가 모바일/웹에서 '밥 주기', '쓰다듬기', '산책하기' 등의 인터랙션을 선택하면 AI가 해당 반려동물의 외형을 재현한 상호작용 영상을 생성하여 제공하는 감성 테크 서비스입니다.

**Target**: 소규모 베타 테스트 (5~10명)
**Platform**: PWA (Progressive Web App) - 설치 가능한 모바일 웹앱

## 2. 핵심 기능 (Core Features)

### MVP 기능
1. **Pet Identity 분석**: Gemini 2.0 Flash로 사진 분석 → 특징 추출 (종, 털 색상, 무늬, 고유 특징)
2. **Dynamic Video Generation**: Luma Dream Machine으로 5~10초 인터랙션 영상 생성
3. **Real-time Progress**: SSE로 영상 생성 진행 상황 실시간 표시
4. **Legacy Archive**: 생성된 영상 아카이브 (날짜별 타임라인)
5. **PWA**: 모바일 홈 화면에 설치 가능

### 인터랙션 종류
- 🍖 밥 주기 (Feeding)
- 🤲 쓰다듬기 (Petting)
- 🎾 놀아주기 (Playing)
- 🚶 산책하기 (Walking)

## 3. 기술 스택 (Tech Stack)

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **PWA**: next-pwa
- **Deploy**: Vercel (무료 티어)

### Backend
- **Framework**: Java Spring Boot 3.x
- **ORM**: Spring Data JPA
- **Security**: Spring Security + JWT
- **Deploy**: Railway 또는 Render (무료 티어)

### AI Services
- **Image Analysis**: Gemini 2.0 Flash API (무료 티어 1,500 req/day)
- **Video Generation**: Luma Dream Machine API (무료 티어 30 videos/month)

### Infrastructure (로컬 개발)
- **Database**: MySQL 8.0 (로컬) 또는 PlanetScale (무료)
- **Cache**: Redis (로컬) 또는 Upstash (무료)
- **Storage**: AWS S3 (프리티어 5GB/월)

### 예상 월 비용
- **개발/베타 단계**: $0~5 (거의 무료)
- **정식 서비스**: 사용량에 따라 확장

## 4. 시스템 아키텍처

```
┌─────────────────────────────────────┐
│     Frontend (Next.js PWA)         │
│  - 사진 업로드 UI                   │
│  - 인터랙션 버튼 (밥주기 등)        │
│  - 실시간 진행 상황 표시 (SSE)      │
│  - 영상 아카이브 타임라인           │
└─────────────┬───────────────────────┘
              │ REST API / SSE
              ▼
┌─────────────────────────────────────┐
│   Backend (Spring Boot)            │
│  - User/Pet/Video CRUD API         │
│  - AI API 통합                      │
│  - 비동기 작업 큐                   │
│  - SSE 진행 상황 스트리밍          │
└───┬──────────┬──────────┬───────────┘
    │          │          │
    ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌─────────┐
│ MySQL  │ │ Redis  │ │ AWS S3  │
│        │ │        │ │         │
│ Users  │ │ Jobs   │ │ Images  │
│ Pets   │ │ Status │ │ Videos  │
│ Videos │ │        │ │         │
└────────┘ └────────┘ └─────────┘
    │          │          │
    └──────────┴──────────┘
              │
              ▼
┌─────────────────────────────────────┐
│         External AI APIs           │
│                                    │
│  ┌─────────────────────────────┐  │
│  │ Gemini 2.0 Flash            │  │
│  │ 사진 → 특징 추출 JSON        │  │
│  └─────────────────────────────┘  │
│                                    │
│  ┌─────────────────────────────┐  │
│  │ Luma Dream Machine          │  │
│  │ 이미지 + 프롬프트 → 영상     │  │
│  └─────────────────────────────┘  │
└─────────────────────────────────────┘
```

## 5. 데이터 플로우

### 5.1. 반려동물 등록
```
1. 사용자 → 사진 5~10장 업로드
2. Frontend → S3 직접 업로드 (Presigned URL)
3. Frontend → Backend API 호출 (사진 URL 배열 전달)
4. Backend → Gemini 2.0 Flash API 호출
   Input: 사진 URLs
   Output: {
     "species": "Golden Retriever",
     "fur_color": "golden blonde with white chest",
     "eye_color": "dark brown",
     "unique_features": "small brown spot on left ear",
     "body_type": "medium-sized, athletic"
   }
5. Backend → MySQL에 Pet + AI Description 저장
6. Frontend → 등록 완료 화면
```

### 5.2. 인터랙션 & 영상 생성
```
1. 사용자 → "밥 주기" 버튼 클릭
2. Frontend → Backend API 호출
3. Backend → Redis에 Job 생성 (status: pending)
4. Backend → SSE 연결 시작 (진행 상황 스트리밍)
5. Backend → Luma API 호출
   {
     "image_url": "대표 사진 S3 URL",
     "prompt": "A [AI Description], eating food from a bowl naturally, happy expression, realistic motion"
   }
6. Backend → Luma Job ID 저장, 상태 폴링 시작
7. SSE → Frontend에 실시간 업데이트
   - "영상 생성 시작... 0%"
   - "처리 중... 30%"
   - "거의 완료... 80%"
8. Luma → 영상 생성 완료 (1~3분)
9. Backend → 영상 다운로드 → S3 업로드
10. Backend → MySQL에 Video 레코드 저장
11. SSE → "완료! 100%" + Video URL
12. Frontend → 영상 자동 재생
```

## 6. 데이터베이스 스키마

```sql
-- 사용자
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(100),
  provider VARCHAR(20), -- 'local', 'google', 'kakao'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 반려동물
CREATE TABLE pets (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  name VARCHAR(100) NOT NULL,
  species VARCHAR(50),
  ai_description TEXT,  -- Gemini 분석 결과
  primary_image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  memorial_date DATE,  -- 무지개다리 날짜 (선택)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 반려동물 사진들
CREATE TABLE pet_images (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  pet_id BIGINT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
);

-- 생성된 영상들
CREATE TABLE videos (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  pet_id BIGINT NOT NULL,
  interaction_type VARCHAR(50) NOT NULL,  -- 'feeding', 'petting', 'playing', 'walking'
  video_url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  duration_seconds INT DEFAULT 5,
  luma_job_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
  INDEX idx_pet_created (pet_id, created_at DESC)
);

-- 영상 생성 작업 (Redis 백업/로깅용)
CREATE TABLE video_jobs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  pet_id BIGINT NOT NULL,
  interaction_type VARCHAR(50),
  status VARCHAR(20),  -- 'pending', 'processing', 'completed', 'failed'
  luma_job_id VARCHAR(100),
  error_message TEXT,
  progress_percent INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (pet_id) REFERENCES pets(id)
);
```

## 7. API 엔드포인트 설계

### Authentication
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/refresh` - 토큰 갱신

### Pets
- `GET /api/pets` - 내 반려동물 목록
- `POST /api/pets` - 반려동물 등록 (사진 URL 배열 + 이름)
- `GET /api/pets/{id}` - 반려동물 상세
- `PUT /api/pets/{id}` - 반려동물 정보 수정
- `DELETE /api/pets/{id}` - 반려동물 삭제

### Videos
- `GET /api/pets/{petId}/videos` - 특정 반려동물 영상 목록
- `POST /api/pets/{petId}/videos` - 영상 생성 요청
  ```json
  {
    "interactionType": "feeding"
  }
  ```
- `GET /api/videos/{id}` - 영상 상세
- `DELETE /api/videos/{id}` - 영상 삭제

### Video Generation (SSE)
- `GET /api/videos/{videoId}/progress` - SSE 진행 상황 스트리밍
  ```
  event: progress
  data: {"status": "processing", "percent": 30, "message": "영상 생성 중..."}

  event: complete
  data: {"status": "completed", "videoUrl": "https://..."}
  ```

### Storage
- `POST /api/storage/presigned-url` - S3 Presigned URL 발급 (업로드용)

## 8. 개발 로드맵

### Phase 1: MVP 기반 구축 (2주)
- [ ] 프로젝트 초기 설정
  - [ ] Spring Boot 프로젝트 생성
  - [ ] Next.js 프로젝트 생성
  - [ ] MySQL, Redis 로컬 환경 구축
- [ ] 인증 시스템
  - [ ] JWT 기반 인증
  - [ ] 회원가입/로그인 API
- [ ] 반려동물 등록
  - [ ] S3 이미지 업로드
  - [ ] Gemini API 통합 (특징 추출)
  - [ ] Pet CRUD API

### Phase 2: AI 영상 생성 (2주)
- [ ] Luma API 통합
  - [ ] 영상 생성 요청
  - [ ] Job 상태 폴링
- [ ] 비동기 처리
  - [ ] Redis 작업 큐
  - [ ] SSE 진행 상황 스트리밍
- [ ] 영상 저장 및 조회
  - [ ] S3 영상 업로드
  - [ ] Video API 구현

### Phase 3: 프론트엔드 & PWA (2주)
- [ ] UI/UX 구현
  - [ ] 반려동물 등록 플로우
  - [ ] 인터랙션 버튼
  - [ ] 영상 재생 화면
  - [ ] 아카이브 타임라인
- [ ] PWA 설정
  - [ ] Manifest.json
  - [ ] Service Worker
  - [ ] 오프라인 지원
- [ ] 배포
  - [ ] Vercel (Frontend)
  - [ ] Railway (Backend)
  - [ ] 베타 테스트

## 9. 주요 기술적 과제

### 9.1. 외형 일관성 (Visual Consistency)
**문제**: 텍스트만으로는 동일한 반려동물 재현이 어려움
**해결**:
- Luma의 Image-to-Video 기능 활용 (참조 이미지 제공)
- Gemini의 상세한 특징 묘사를 프롬프트에 결합
- 여러 각도 사진으로 일관성 향상

### 9.2. 생성 시간 지연 (Latency)
**문제**: 영상 생성에 1~3분 소요
**해결**:
- SSE로 실시간 진행 상황 표시
- "기다리는 동안" 감성적 메시지 표시
- 이전 영상 다시보기 추천

### 9.3. API 무료 티어 한계
**문제**: Luma 무료 30 videos/month
**해결**:
- 베타 테스트는 무료로 충분 (5~10명)
- 추후 유료 플랜 또는 다른 API 병행 사용
- 사용자당 월 생성 횟수 제한 옵션