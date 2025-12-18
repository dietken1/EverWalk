# EverWalk 빠른 시작 가이드

## 5분 안에 시작하기

### 1. 환경 변수 설정 (2분)

#### Backend 환경 변수
```bash
cd backend
cp .env.example .env
```

`.env` 파일을 열고 필수 API 키 입력:
```env
# 필수: AI API 키
GEMINI_API_KEY=your-gemini-api-key-here
LUMA_API_KEY=your-luma-api-key-here

# 필수: AWS S3 (나중에 설정 가능)
AWS_ACCESS_KEY=your-aws-access-key
AWS_SECRET_KEY=your-aws-secret-key
AWS_S3_BUCKET=everwalk-storage

# JWT Secret (랜덤 문자열로 변경)
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string
```

#### Frontend 환경 변수
```bash
cd ../frontend
cp .env.example .env.local
```

`.env.local` 파일:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 2. Docker로 데이터베이스 실행 (1분)

```bash
# 프로젝트 루트로 이동
cd ..

# MySQL & Redis 시작
docker-compose up -d

# 확인
docker-compose ps
# everwalk-mysql와 everwalk-redis가 "Up" 상태여야 함
```

### 3. Backend 실행 (1분)

#### 방법 1: 터미널
```bash
cd backend
./gradlew bootRun
```

#### 방법 2: IntelliJ IDEA (권장)
1. IntelliJ에서 `EverWalk` 프로젝트 열기
2. `backend/src/main/java/com/everwalk/EverWalkApplication.java` 열기
3. 좌측 녹색 실행 버튼 클릭 또는 `Shift + F10`

**확인**: http://localhost:8080/api/health
```json
{
  "status": "UP",
  "service": "EverWalk Backend",
  "version": "1.0.0"
}
```

### 4. Frontend 실행 (1분)

```bash
cd frontend
npm install  # 처음 한 번만
npm run dev
```

**확인**: http://localhost:3000

---

## API 키 발급 방법

### Google Gemini API
1. https://ai.google.dev/ 접속
2. "Get API Key" 클릭
3. Google 계정으로 로그인
4. API 키 복사 → `.env`의 `GEMINI_API_KEY`에 붙여넣기

**무료 티어**: 1,500 requests/day

### Luma Labs API
1. https://lumalabs.ai/ 접속
2. 계정 생성 후 로그인
3. API 섹션에서 API 키 발급
4. API 키 복사 → `.env`의 `LUMA_API_KEY`에 붙여넣기

**무료 티어**: 30 videos/month

### AWS S3 (선택사항, 나중에 설정 가능)
1. AWS 계정 생성: https://aws.amazon.com
2. IAM에서 새 사용자 생성
3. S3 권한 부여
4. Access Key 생성 → `.env`에 입력

---

## 트러블슈팅

### "Could not connect to MySQL"
```bash
# Docker 컨테이너 재시작
docker-compose restart mysql

# 로그 확인
docker-compose logs mysql
```

### "gradlew: Permission denied"
```bash
chmod +x backend/gradlew
```

### "Port 8080 already in use"
```bash
# 기존 프로세스 종료 (Windows)
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# 또는 application.yml에서 포트 변경
# server.port: 8081
```

### Frontend가 Backend를 찾지 못할 때
1. Backend가 실행 중인지 확인: http://localhost:8080/api/health
2. `.env.local`의 URL이 정확한지 확인
3. CORS 오류라면 `SecurityConfig.java` 확인

---

## 다음 단계

프로젝트가 정상 실행되면:

1. **Swagger UI 확인**: http://localhost:8080/swagger-ui.html
2. **개발 가이드 읽기**: [DEVELOPMENT.md](DEVELOPMENT.md)
3. **프로젝트 설계 이해**: [PROJECT.md](PROJECT.md)

### 추천 개발 순서
1. 인증 시스템 (로그인/회원가입)
2. 반려동물 등록 기능
3. 이미지 업로드 & Gemini 분석
4. Luma 영상 생성
5. UI/UX 개선 & PWA 설정

---

## 도움이 필요하면

- Backend 이슈: `backend/` 디렉토리에서 로그 확인
- Frontend 이슈: 브라우저 Console (F12) 확인
- 전체 로그: `docker-compose logs -f`

행운을 빕니다! 🐕✨
