---
title: Docker 설치 (Ubuntu 24.04 LTS)
tags:
  - Docker
  - Ubuntu24_04
  - VirtualBox
date: 2026-01-28
draft: "false"
---
## 개발 환경

> [!info] 🛠️ 실습 환경
> - **OS**: Ubuntu 24.04 LTS (VM, VirtualBox)
> - **Arch**: amd64 (x86_64)


## Docker 설치

### 1. 사전 설정 및 저장소 추가

```bash title="Terminal"
# 1. 필수 패키지 설치
sudo apt-get update
sudo apt-get install -y ca-certificates curl

# 2. GPG 키 등록
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# 3. 저장소 추가 (Arch/OS 자동 감지)
echo \ "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \ $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \ sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
```

### 2. Docker 엔진 설치&실행
``` bash title="Terminal"
# 1. Docker 엔진 설치
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 2. 현재 사용자를 'docker' 그룹에 추가 & 즉시 적용
sudo usermod -aG docker $USER
newgrp docker

# 3. 테스트 (hello-world 컨테이너 실행)
docker run hello-world
```


## 실행 결과

![[/assets/docker_test.png|650]]
*▲ 그림 1. 도커 설치 결과*
