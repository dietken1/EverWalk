# EverWalk 개발 가이드

## 프로젝트 구조

```
EverWalk/
├── backend/                    # Spring Boot Backend
│   ├── src/
│   │   └── main/
│   │       ├── java/com/everwalk/
│   │       │   ├── config/           # 설정 파일
│   │       │   ├── controller/       # REST API 컨트롤러
│   │       │   ├── service/          # 비즈니스 로직
│   │       │   ├── repository/       # 데이터 접근 계층
│   │       │   ├── model/            # Entity 모델
│   │       │   ├── dto/              # Data Transfer Objects
│   │       │   ├── security/         # JWT 인증/인가
│   │       │   ├── exception/        # 예외 처리
│   │       │   └── util/             # 유틸리티
│   │       └── resources/
│   │           ├── application.yml   # 애플리케이션 설정
│   │           └── db/init.sql       # 데이터베이스 초기화
│   ├── build.gradle                  # Gradle 빌드 파일
│   ├── Dockerfile                    # Docker 이미지 빌드
│   └── .env.example                  # 환경 변수 예시
│
├── frontend/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/                # App Router 페이지
│   │   ├── components/         # React 컴포넌트
│   │   ├── lib/                # 라이브러리 & API 클라이언트
│   │   ├── hooks/              # Custom React Hooks
│   │   └── types/              # TypeScript 타입 정의
│   ├── public/                 # 정적 파일
│   │   └── manifest.json       # PWA 매니페스트
│   ├── package.json
│   ├── next.config.js          # Next.js 설정
│   ├── tailwind.config.ts      # Tailwind CSS 설정
│   └── .env.example
│
├── .github/
│   └── workflows/              # GitHub Actions CI/CD
│       ├── backend-ci.yml      # Backend 빌드/테스트
│       ├── frontend-ci.yml     # Frontend 빌드/테스트
│       └── deploy-production.yml # 배포 자동화
│
├── docker-compose.yml          # 로컬 개발 환경
├── PROJECT.md                  # 프로젝트 상세 설계
└── README.md
```

## 로컬 개발 환경 설정

### 1. 사전 요구사항

- **Java 17+** (OpenJDK 또는 Temurin 권장)
- **Node.js 18+**
- **Docker & Docker Compose**
- **Git**

### 2. 레포지토리 클론

```bash
git clone <repository-url>
cd EverWalk
```

### 3. 환경 변수 설정

#### Backend
```bash
cd backend
cp .env.example .env
```

`.env` 파일을 열고 다음 항목을 설정:
- `AWS_ACCESS_KEY`, `AWS_SECRET_KEY`: AWS S3 자격증명
- `GEMINI_API_KEY`: Google Gemini API 키
- `LUMA_API_KEY`: Luma Labs API 키
- `JWT_SECRET`: 랜덤 문자열 (최소 256비트)

#### Frontend
```bash
cd ../frontend
cp .env.example .env.local
```

`.env.local` 파일 수정:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 4. Docker로 MySQL & Redis 실행

```bash
# 프로젝트 루트에서
docker-compose up -d

# 확인
docker-compose ps
```

### 5. Backend 실행

```bash
cd backend
./gradlew bootRun
```

또는 IntelliJ IDEA에서:
1. `EverWalkApplication.java` 열기
2. 우클릭 → Run

**확인**: http://localhost:8080/api/health

### 6. Frontend 실행

```bash
cd frontend
npm install
npm run dev
```

**확인**: http://localhost:3000

## API 개발

### 새로운 API 엔드포인트 추가

1. **DTO 생성** (`backend/src/main/java/com/everwalk/dto/`)
```java
@Data
public class CreatePetRequest {
    private String name;
    private List<String> imageUrls;
}
```

2. **Service 로직** (`backend/src/main/java/com/everwalk/service/`)
```java
@Service
@RequiredArgsConstructor
public class PetService {
    public Pet createPet(CreatePetRequest request) {
        // 비즈니스 로직
    }
}
```

3. **Controller** (`backend/src/main/java/com/everwalk/controller/`)
```java
@RestController
@RequestMapping("/pets")
public class PetController {

    @PostMapping
    public ResponseEntity<Pet> createPet(@RequestBody CreatePetRequest request) {
        // ...
    }
}
```

4. **Swagger 문서 자동 생성**: http://localhost:8080/swagger-ui.html

## 프론트엔드 개발

### 새로운 페이지 추가

```typescript
// frontend/src/app/pets/page.tsx
export default function PetsPage() {
  return <div>My Pets</div>
}
```

### API 호출

```typescript
// frontend/src/lib/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

export const getPets = async () => {
  const { data } = await api.get('/pets')
  return data
}
```

### React Query 사용

```typescript
'use client'
import { useQuery } from '@tanstack/react-query'
import { getPets } from '@/lib/api'

export default function PetList() {
  const { data, isLoading } = useQuery({
    queryKey: ['pets'],
    queryFn: getPets,
  })

  if (isLoading) return <div>Loading...</div>
  return <div>{/* Pet list */}</div>
}
```

## 테스트

### Backend 테스트

```bash
cd backend
./gradlew test

# 특정 테스트만
./gradlew test --tests PetServiceTest
```

### Frontend 테스트

```bash
cd frontend
npm run lint
npm run type-check
```

## 빌드

### Backend JAR 빌드

```bash
cd backend
./gradlew build
# 결과: build/libs/everwalk-backend-0.0.1-SNAPSHOT.jar
```

### Frontend Production 빌드

```bash
cd frontend
npm run build
npm run start  # 프로덕션 모드로 실행
```

## 배포

### Frontend (Vercel)

1. Vercel 계정 생성: https://vercel.com
2. GitHub 레포지토리 연결
3. 프로젝트 설정:
   - Framework: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
4. 환경 변수 설정:
   - `NEXT_PUBLIC_API_URL`: 배포된 백엔드 URL

### Backend (Railway)

1. Railway 계정 생성: https://railway.app
2. 프로젝트 생성 → GitHub 연결
3. 서비스 설정:
   - Root Directory: `backend`
   - Build Command: `./gradlew build -x test`
   - Start Command: `java -jar build/libs/*.jar`
4. 환경 변수 모두 설정 (`.env.example` 참고)
5. MySQL & Redis 플러그인 추가

## CI/CD

### GitHub Actions 자동화

- **Push to `develop`**: 자동 빌드 & 테스트
- **Push to `main`**: 빌드 → 테스트 → 배포
- **Pull Request**: 빌드 & 테스트

### GitHub Secrets 설정

1. Repository → Settings → Secrets and variables → Actions
2. 다음 Secrets 추가:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
   - `RAILWAY_TOKEN`

## 트러블슈팅

### Backend가 MySQL에 연결되지 않을 때

```bash
# Docker 컨테이너 확인
docker-compose ps

# MySQL 로그 확인
docker-compose logs mysql

# 재시작
docker-compose restart mysql
```

### Frontend가 Backend API를 호출하지 못할 때

1. CORS 설정 확인 (`SecurityConfig.java`)
2. `.env.local`의 `NEXT_PUBLIC_API_URL` 확인
3. Backend가 실행 중인지 확인

### Gradle 빌드 실패

```bash
# Gradle 캐시 정리
cd backend
./gradlew clean build --refresh-dependencies
```

## 다음 단계

1. **인증 시스템 구현**
   - [ ] 회원가입/로그인 API
   - [ ] JWT 토큰 발급
   - [ ] Frontend 로그인 UI

2. **반려동물 관리**
   - [ ] Pet CRUD API
   - [ ] 이미지 업로드 (S3)
   - [ ] Gemini API 통합

3. **영상 생성**
   - [ ] Luma API 통합
   - [ ] 비동기 작업 큐
   - [ ] SSE 진행 상황

자세한 설계는 [PROJECT.md](PROJECT.md)를 참고하세요.
