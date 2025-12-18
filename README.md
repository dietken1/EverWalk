# EverWalk

> 추억 속 반려동물과 영원히 함께 걷는 시간

무지개다리를 건넌 반려동물과 AI 기술로 다시 만나는 감성 테크 서비스입니다.

## 프로젝트 구조

```
EverWalk/
├── backend/          # Spring Boot API 서버
├── frontend/         # Next.js PWA 웹앱
├── docker-compose.yml # 로컬 개발 환경
└── PROJECT.md        # 상세 설계 문서
```

## 기술 스택

### Backend
- Java 17 + Spring Boot 3.x
- Spring Data JPA + MySQL
- Spring Security + JWT
- Redis (작업 큐)
- AWS S3 (파일 저장소)

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- PWA (Progressive Web App)

### AI Services
- Gemini 2.0 Flash (이미지 분석)
- Luma Dream Machine (영상 생성)

## 시작하기

### 필요 도구
- Java 17+
- Node.js 18+
- Docker & Docker Compose
- MySQL 8.0
- Redis

### 로컬 개발 환경 설정

1. **레포지토리 클론**
```bash
git clone <repository-url>
cd EverWalk
```

2. **환경 변수 설정**
```bash
# Backend
cp backend/.env.example backend/.env
# 필수: AWS, Gemini, Luma API 키 입력

# Frontend
cp frontend/.env.example frontend/.env.local
```

3. **Docker Compose로 MySQL & Redis 실행**
```bash
docker-compose up -d
```

4. **Backend 실행**
```bash
cd backend
./gradlew bootRun
```

5. **Frontend 실행**
```bash
cd frontend
npm install
npm run dev
```

6. **브라우저에서 열기**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

## API 문서

Backend 실행 후 Swagger UI 접근:
- http://localhost:8080/swagger-ui.html

## 배포

### Frontend (Vercel)
```bash
cd frontend
vercel deploy --prod
```

### Backend (Railway)
```bash
# Railway CLI 설치
npm i -g @railway/cli

# 배포
cd backend
railway up
```

## 주요 기능

- 반려동물 사진 업로드 및 AI 특징 분석
- AI 기반 인터랙션 영상 생성 (밥주기, 쓰다듬기, 놀기, 산책)
- 실시간 영상 생성 진행 상황 표시
- 생성된 영상 아카이브 타임라인
- PWA 지원 (모바일 설치 가능)

## 라이선스

Private - All rights reserved
