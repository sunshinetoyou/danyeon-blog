---
title: WebGoat 환경 구축
tags:
  - WebHacking
  - WebGoat
draft: "true"
date:
---
## What is WebGoat?

OWASP(Open Web Application Security Project)에서 만든 취약한 웹 사이트임.
⚠️이 부분은 WebGoat와 어느 정도 친해진 이후 다시 작성할 예정임다.

> [!caution] 주의사항
> - 본 프로그램은 취약하게 설계됐기에, **실습 중 인터넷 연결 끊기**를 강력히 권고
> - 여기서 학습한 공격 기법을 활용하여 **타 사이트를 무단으로 공격하지 마라**.


## 환경 구축

### 방법 1. Docker

(docker가 설치되어 있다 가정)

WebGoat는 DockerHub에서 **두 가지 이미지**를 제공하고 있습니다.
- [기본 이미지](https://hub.docker.com/r/webgoat/webgoat) (`webgoat/webgoat`): WebGoat 서버만 포함된 버전입니다.
- [데스크탑 이미지](https://hub.docker.com/r/webgoat/webgoat-desktop) (`webgoat/webgoat-desktop`): 공격 환경과 도구가 세팅된 통합 실습 환경입니다.

하나의 VM에서 다양한 웹 해킹 실습을 진행할 예정이기 때문에 **기본 이미지를 사용**합니다.

> [!code] 📒webgoat 로컬 컨테이너 실행 명령
> ``` sh
> # 초기 실행 방법
> # webgoat라는 이름으로 로컬 컨테이너 생성&실행
> docker run --name webgoat -it -p 127.0.0.1:8080:8080 -p 127.0.0.1:9090:9090 webgoat/webgoat
> 
> # 이후 실행 방법 
> # WebGoat라는 이름의 로컬 컨테이너 실행
> docker run webgoat
> ```






## Reference
https://github.com/WebGoat/WebGoat
https://owasp.org/www-project-webgoat/