# AWS EC2 배포 가이드 (3개 인스턴스)

WorldLand 프로젝트를 AWS EC2 인스턴스 3개에 각각 배포합니다.

## 아키텍처

| 인스턴스 | 앱                | 도메인                       | 포트 |
| -------- | ----------------- | ---------------------------- | ---- |
| EC2 #1   | Landing (Next.js) | `worldland.foundation`       | 3000 |
| EC2 #2   | Cloud (Next.js)   | `cloud.worldland.foundation` | 3001 |
| EC2 #3   | Docs (VitePress)  | `docs.worldland.foundation`  | 3002 |

---

## 1. EC2 인스턴스 생성

각 인스턴스에 대해 다음 설정을 사용합니다:

### 권장 사양

- **AMI**: Ubuntu 24.04 LTS
- **Instance Type**: `t3.small` (Landing/Cloud), `t3.micro` (Docs)
- **Storage**: 20GB gp3
- **Security Group**:
  - SSH (22): 내 IP
  - HTTP (80): 0.0.0.0/0
  - HTTPS (443): 0.0.0.0/0

---

## 2. 기본 설정 (모든 인스턴스 공통)

각 인스턴스에 SSH로 접속 후 실행:

```bash
# 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# Node.js 20 설치
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PM2 설치 (프로세스 관리)
sudo npm install -g pm2

# Nginx 설치 (리버스 프록시)
sudo apt install -y nginx

# Git 설치
sudo apt install -y git

# 버전 확인
node -v  # v20.x.x
npm -v   # 10.x.x
```

---

## 3. 앱별 배포

### 3-A. Landing 인스턴스 (EC2 #1)

```bash
# 프로젝트 클론
cd /home/ubuntu
git clone https://github.com/cryptoecc/worldland_web.git
cd worldland_web/landing

# 의존성 설치 및 빌드
npm install
npm run build

# PM2로 실행
pm2 start npm --name "landing" -- start -- -p 3000
pm2 save
pm2 startup
```

**Nginx 설정**:

```bash
sudo nano /etc/nginx/sites-available/landing
```

```nginx
server {
    listen 80;
    server_name worldland.foundation www.worldland.foundation;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/landing /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

### 3-B. Cloud 인스턴스 (EC2 #2)

```bash
# 프로젝트 클론
cd /home/ubuntu
git clone https://github.com/cryptoecc/worldland_web.git
cd worldland_web/cloud

# 환경 변수 설정 (필요시)
nano .env.local
# NEXT_PUBLIC_API_URL=https://api.worldland.foundation
# 기타 환경 변수...

# 의존성 설치 및 빌드
npm install
npm run build

# PM2로 실행
pm2 start npm --name "cloud" -- start -- -p 3001
pm2 save
pm2 startup
```

**Nginx 설정**:

```bash
sudo nano /etc/nginx/sites-available/cloud
```

```nginx
server {
    listen 80;
    server_name cloud.worldland.foundation;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/cloud /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

### 3-C. Docs 인스턴스 (EC2 #3)

VitePress는 정적 사이트이므로 Nginx에서 직접 서빙합니다.

```bash
# 프로젝트 클론
cd /home/ubuntu
git clone https://github.com/cryptoecc/worldland_web.git
cd worldland_web/docs

# 의존성 설치 및 빌드
npm install
npm run build

# 빌드 결과물을 Nginx 웹 루트로 복사
sudo cp -r .vitepress/dist/* /var/www/html/
```

**Nginx 설정**:

```bash
sudo nano /etc/nginx/sites-available/docs
```

```nginx
server {
    listen 80;
    server_name docs.worldland.foundation;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 캐싱 설정
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/docs /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

## 4. SSL 인증서 설정 (Let's Encrypt)

각 인스턴스에서 실행:

```bash
# Certbot 설치
sudo apt install -y certbot python3-certbot-nginx

# SSL 인증서 발급 (도메인별로 실행)
# Landing:
sudo certbot --nginx -d worldland.foundation -d www.worldland.foundation

# Cloud:
sudo certbot --nginx -d cloud.worldland.foundation

# Docs:
sudo certbot --nginx -d docs.worldland.foundation

# 자동 갱신 테스트
sudo certbot renew --dry-run
```

---

## 5. Route 53 DNS 설정

Route 53 콘솔에서 각 EC2 인스턴스의 **Elastic IP**를 레코드에 연결합니다.

### Elastic IP 할당 (필수!)

각 인스턴스에 Elastic IP를 할당해야 재부팅 시에도 IP가 유지됩니다.

1. EC2 콘솔 → **Elastic IPs** → **Allocate Elastic IP address**
2. 생성된 IP를 각 인스턴스에 **Associate**

### DNS 레코드 추가

| 레코드 이름 | 유형 | 값 (Elastic IP)     |
| ----------- | ---- | ------------------- |
| `@` (루트)  | `A`  | Landing 인스턴스 IP |
| `www`       | `A`  | Landing 인스턴스 IP |
| `cloud`     | `A`  | Cloud 인스턴스 IP   |
| `docs`      | `A`  | Docs 인스턴스 IP    |

---

## 6. 업데이트 배포 스크립트

각 인스턴스에 배포 스크립트를 만들어두면 편리합니다.

### Landing/Cloud용 (`deploy.sh`)

```bash
#!/bin/bash
cd /home/ubuntu/worldland_web
git pull origin master

# Landing의 경우
cd landing
npm install
npm run build
pm2 restart landing

# Cloud의 경우
# cd cloud
# npm install
# npm run build
# pm2 restart cloud
```

### Docs용 (`deploy.sh`)

```bash
#!/bin/bash
cd /home/ubuntu/worldland_web
git pull origin master
cd docs
npm install
npm run build
sudo cp -r .vitepress/dist/* /var/www/html/
```

실행:

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 7. PM2 모니터링

```bash
# 상태 확인
pm2 status

# 로그 확인
pm2 logs

# 모니터링 대시보드
pm2 monit
```

---

## 8. 보안 체크리스트

- [ ] SSH 키 기반 인증만 사용 (비밀번호 로그인 비활성화)
- [ ] Security Group에서 필요한 포트만 오픈
- [ ] 환경 변수에 민감한 정보 저장 (.env.local)
- [ ] Let's Encrypt 자동 갱신 활성화
- [ ] 정기적인 `apt upgrade` 실행
