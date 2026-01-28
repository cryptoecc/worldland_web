# AWS Amplify 배포 가이드 (최신)

WorldLand 프로젝트는 **Monorepo** 구조입니다. AWS Amplify에서 **하나의 리포지토리**를 **3번 연결**하여 각각 다른 폴더를 배라하면 됩니다.

## 0. 사전 준비 (필수)

Amplify는 GitHub/GitLab 원격 저장소를 기반으로 배포합니다.
현재 로컬의 변경 사항(폴더 구조 변경 등)을 모두 커밋하고 푸시해야 합니다.

```bash
git add .
git commit -m "Refactor: Convert to monorepo with landing, cloud, docs"
git push origin main
```

## 1. Amplify Console 접속

1. [AWS Amplify Console](https://console.aws.amazon.com/amplify/home) 접속
2. **"New App"** -> **"Host Web App"** (또는 "Create new app") 선택
3. **GitHub** (또는 사용하는 Git 제공자) 선택 후 리포지토리 연결

---

## 2. 앱별 배포 설정 (총 3개의 앱 생성)

아래 과정을 3번 반복하여 3개의 Amplify 앱을 만듭니다.

### A. Landing (메인 웹사이트)

- **Repository**: WorldLand 리포지토리 선택
- **Branch**: `main`
- **Monorepo settings**: [체크 ✅]
- **Monorepo root directory**: `landing`
- **Build settings**: (자동 감지됨 - Next.js)
  - Build command: `npm run build`
  - Output directory: `.next`
- **배포 후 도메인 연결**: `worldland.foundation` (www 포함)

### B. Cloud Console

- **Repository**: WorldLand 리포지토리 선택 (위와 동일)
- **Branch**: `main`
- **Monorepo settings**: [체크 ✅]
- **Monorepo root directory**: `cloud-console`
- **Build settings**: (자동 감지됨 - Next.js)
- **Environment Variables**:
  - Amplify Console > App settings > Environment variables 메뉴에서 `.env.local`에 있던 내용을 추가해야 합니다.
- **배포 후 도메인 연결**: `cloud.worldland.foundation`

### C. Docs (문서 사이트)

- **Repository**: WorldLand 리포지토리 선택 (위와 동일)
- **Branch**: `main`
- **Monorepo settings**: [체크 ✅]
- **Monorepo root directory**: `docs`
- **Build settings (수정 필요 ⚠️)**:
  - VitePress는 Next.js와 설정이 다릅니다. **Edit** 버튼을 눌러 수정해주세요.
  - **Build command**: `npm run build`
  - **Output directory**: `docs/.vitepress/dist` (매우 중요: VitePress 기본 출력 경로)
- **배포 후 도메인 연결**: `docs.worldland.foundation`

---

## 3. 도메인 설정 (Domain Management)

각 앱이 배포에 성공하면, 사이드바의 **Domain management** 메뉴로 이동합니다.

1.  **Landing 앱**에서:
    - Domain: `worldland.foundation` 추가
    - Subdomain: `www` -> Landing 앱
    - Subdomain: `@` (root) -> Landing 앱
2.  **Cloud Console 앱**에서:
    - Domain: `cloud.worldland.foundation` (Custom domain 추가)
3.  **Docs 앱**에서:
    - Domain: `docs.worldland.foundation` (Custom domain 추가)

## 4. 문제 해결

- **빌드 실패 시**:
  - Amplify Console > Build settings > App build specification (amplify.yml)을 확인합니다.
  - Monorepo 루트의 `package.json`과 각 앱의 `package.json` 의존성이 올바르게 설치되는지 확인합니다.
- **VitePress 스타일 깨짐**:
  - Output directory가 `docs/.vitepress/dist`로 정확히 설정되었는지 확인합니다.
