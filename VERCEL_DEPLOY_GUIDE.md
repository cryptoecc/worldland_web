# Vercel 배포 가이드 (Route 53 도메인 연결)

WorldLand 프로젝트는 **Monorepo** 구조입니다. Vercel에서 **하나의 리포지토리**를 **3번 연결**하여 각각 다른 폴더를 배포합니다.

## 프로젝트 구조

| 폴더      | 프레임워크 | 도메인                       |
| --------- | ---------- | ---------------------------- |
| `landing` | Next.js    | `worldland.foundation`       |
| `cloud`   | Next.js    | `cloud.worldland.foundation` |
| `docs`    | VitePress  | `docs.worldland.foundation`  |

---

## 1. Vercel 배포 (3개 프로젝트 생성)

### A. Landing 배포

1. [Vercel](https://vercel.com) 접속 → **"Add New Project"**
2. **GitHub** 연결 → `cryptoecc/worldland_web` 리포지토리 선택
3. **Configure Project**:
   - **Root Directory**: `landing` 입력 (Edit 버튼 클릭 후)
   - **Framework Preset**: `Next.js` (자동 감지)
   - **Build Command**: `npm run build` (기본값)
   - **Output Directory**: `.next` (기본값)
4. **Deploy** 클릭
5. 배포 완료 후 → **Settings** → **Domains** → `worldland.foundation` 추가

### B. Cloud Console 배포

1. Vercel 대시보드 → **"Add New Project"** (또 다른 프로젝트)
2. **같은 리포지토리** (`cryptoecc/worldland_web`) 선택
3. **Configure Project**:
   - **Root Directory**: `cloud` 입력
   - **Framework Preset**: `Next.js` (자동 감지)
4. **Environment Variables** 추가 (필요시):
   - `NEXT_PUBLIC_API_URL` 등 `.env.local`에 있는 변수들
5. **Deploy** 클릭
6. 배포 완료 후 → **Settings** → **Domains** → `cloud.worldland.foundation` 추가

### C. Docs 배포

1. Vercel 대시보드 → **"Add New Project"**
2. **같은 리포지토리** 선택
3. **Configure Project**:
   - **Root Directory**: `docs` 입력
   - **Framework Preset**: `VitePress` (또는 Other)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.vitepress/dist`
4. **Deploy** 클릭
5. 배포 완료 후 → **Settings** → **Domains** → `docs.worldland.foundation` 추가

---

## 2. Route 53 DNS 설정

Vercel에서 커스텀 도메인을 추가하면 DNS 설정 안내가 표시됩니다.

### Route 53 콘솔에서 레코드 추가

1. [Route 53 콘솔](https://console.aws.amazon.com/route53/) 접속
2. **Hosted zones** → `worldland.foundation` 선택

### 레코드 설정

#### Landing (`worldland.foundation`)

| 레코드 이름 | 유형    | 값                     |
| ----------- | ------- | ---------------------- |
| `@` (루트)  | `A`     | `76.76.21.21`          |
| `www`       | `CNAME` | `cname.vercel-dns.com` |

#### Cloud (`cloud.worldland.foundation`)

| 레코드 이름 | 유형    | 값                     |
| ----------- | ------- | ---------------------- |
| `cloud`     | `CNAME` | `cname.vercel-dns.com` |

#### Docs (`docs.worldland.foundation`)

| 레코드 이름 | 유형    | 값                     |
| ----------- | ------- | ---------------------- |
| `docs`      | `CNAME` | `cname.vercel-dns.com` |

> **참고**: Vercel이 도메인 추가 시 정확한 DNS 값을 알려줍니다. 위 값은 일반적인 예시입니다.

---

## 3. SSL 인증서

Vercel이 **자동으로 SSL 인증서를 발급**합니다. DNS 설정 후 몇 분 내에 HTTPS가 활성화됩니다.

---

## 4. 환경 변수 설정

각 Vercel 프로젝트의 **Settings** → **Environment Variables**에서 필요한 환경 변수를 추가합니다.

### Cloud Console 환경 변수 (예시)

```
NEXT_PUBLIC_API_URL=https://api.worldland.foundation
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
```

---

## 5. 로컬 개발

```bash
# 프로젝트 루트에서
npm install
npm run dev
```

| 서비스  | 로컬 URL              |
| ------- | --------------------- |
| Landing | http://localhost:3000 |
| Cloud   | http://localhost:3001 |
| Docs    | http://localhost:3002 |

---

## 6. 문제 해결

### 빌드 실패 시

- Vercel 대시보드 → **Deployments** → 실패한 배포 클릭 → 로그 확인
- Root Directory가 올바르게 설정되었는지 확인

### 도메인 연결 안 될 때

- Route 53 레코드가 올바르게 설정되었는지 확인
- DNS 전파에 최대 48시간 소요될 수 있음 (보통 몇 분 내)

### 환경 변수 문제

- `NEXT_PUBLIC_` 접두사가 붙은 변수만 클라이언트에서 접근 가능
- 환경 변수 변경 후 재배포 필요
