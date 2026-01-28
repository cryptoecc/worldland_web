# AWS Amplify 배포 가이드 (SSR 모드)

WorldLand 프로젝트는 **Monorepo** 구조입니다. AWS Amplify에서 **하나의 리포지토리**를 **3번 연결**하여 각각 다른 폴더를 배포합니다.

## 0. 사전 준비 (필수)

Amplify는 GitHub/GitLab 원격 저장소를 기반으로 배포합니다.
현재 로컬의 변경 사항(폴더 구조 변경 등)을 모두 커밋하고 푸시해야 합니다.

```bash
git add .
git commit -m "Refactor: Convert to monorepo with landing, cloud, docs"
git push origin master
```

## 1. Amplify Console 접속

1. [AWS Amplify Console](https://console.aws.amazon.com/amplify/home) 접속
2. **"New App"** -> **"Host Web App"** (또는 "Create new app") 선택
3. **GitHub** (또는 사용하는 Git 제공자) 선택 후 리포지토리 연결
4. **⚠️ 중요**: 앱 유형을 **"Web Compute"** (SSR 지원)로 선택

---

## 2. 앱별 배포 설정 (총 3개의 앱 생성)

아래 과정을 3번 반복하여 3개의 Amplify 앱을 만듭니다.

### A. Landing (메인 웹사이트) - Next.js SSR

- **Repository**: WorldLand 리포지토리 선택
- **Branch**: `master`
- **Monorepo settings**: [체크 ✅]
- **Monorepo root directory**: `landing`
- **Build settings (중요 ⚠️)**: `amplify.yml`을 아래와 같이 설정해야 합니다.
  ```yaml
  version: 1
  applications:
    - frontend:
        phases:
          preBuild:
            commands:
              - npm ci
          build:
            commands:
              - npm run build
        artifacts:
          baseDirectory: .next
          files:
            - '**/*'
        cache:
          paths:
            - node_modules/**/*
            - .next/cache/**/*
      appRoot: landing
  ```
- **배포 후 도메인 연결**: `worldland.foundation` (www 포함)

### B. Cloud Console - Next.js SSR

- **Repository**: WorldLand 리포지토리 선택 (위와 동일)
- **Branch**: `master`
- **Monorepo settings**: [체크 ✅]
- **Monorepo root directory**: `cloud`
- **Build settings (중요 ⚠️)**:
  ```yaml
  version: 1
  applications:
    - frontend:
        phases:
          preBuild:
            commands:
              - npm ci
          build:
            commands:
              - npm run build
        artifacts:
          baseDirectory: .next
          files:
            - '**/*'
        cache:
          paths:
            - node_modules/**/*
            - .next/cache/**/*
      appRoot: cloud
  ```
- **Environment Variables**:
  - Amplify Console > App settings > Environment variables 메뉴에서 `.env.local`에 있던 내용을 추가해야 합니다.
- **배포 후 도메인 연결**: `cloud.worldland.foundation`

### C. Docs (문서 사이트) - VitePress

- **Repository**: WorldLand 리포지토리 선택 (위와 동일)
- **Branch**: `master`
- **Monorepo settings**: [체크 ✅]
- **Monorepo root directory**: `docs`
- **Build settings (수정 필요 ⚠️)**:
  ```yaml
  version: 1
  applications:
    - frontend:
        phases:
          preBuild:
            commands:
              - npm ci
          build:
            commands:
              - npm run build
        artifacts:
          baseDirectory: .vitepress/dist
          files:
            - '**/*'
        cache:
          paths:
            - node_modules/**/*
      appRoot: docs
  ```
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
- **404 에러 발생 시**:
  - `baseDirectory`가 `.next` (Next.js) 또는 `.vitepress/dist` (VitePress)로 정확히 설정되었는지 확인합니다.
  - Amplify 앱 유형이 **"Web Compute"** (SSR 지원)인지 확인합니다.
- **VitePress 스타일 깨짐**:
  - Output directory가 `.vitepress/dist`로 정확히 설정되었는지 확인합니다.
