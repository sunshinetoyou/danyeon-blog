---
title: 00_WebGoat 환경 구축(for Ubuntu)
tags:
  - WebGoat
  - WebHacking
  - AutoEver
draft: "false"
date: 2026-01-28
---
## What is WebGoat?

~~OWASP(Open Web Application Security Project)에서 만든 취약한 웹 사이트입니다.
WebGoat와 WebWolf 두 종류의 서비스를 한꺼번에 제공합니다.~~
⚠️이 부분은 WebGoat와 어느 정도 친해진 이후 다시 작성할 예정임다.

~~WebGoat는 SpringBoot 프레임워크 기반으로 개발된 취약한 웹 사이트이다. OWASP에서 선정한 다양한 웹 취약점을 사이트에 그대로 옮겨 놓았다는 점에서 처음 웹 해킹을 공부할 때 자주 사용한다.~~
-> 이거 지금 사용하는 도커에서 Java SpringBoot 버전 체크해야 할 듯.

> [!caution] 주의사항
> - 본 프로그램은 취약하게 설계됐기에, **실습 중 인터넷 연결 끊기**를 강력히 권고함.
> - 여기서 학습한 공격 기법을 활용하여 **타 사이트를 무단으로 공격하지 마시오.**.


## 실습 환경 구축

> [!info] 🛠️ 실습 환경
> - **Host OS**: Window 11 Home
> - **Virtualize Program**: VirtualBox(v7.2.4) 
> - **Virtual Machine OS**: Ubuntu 24.04 LTS
> - **Arch**: amd64 (x86_64)

WebGoat 공식 홈페이지에서는 크게 세 가지 방법을 소개합니다.
- **컨테이너 이미지** 활용
- **JAR 파일** 활용
- **소스 코드** 활용

이 글에선 VM 내부에서 컨테이너 이미지를 사용해 WebGoat를 띄우고,
호스트에서 브라우저 띄우고, 분석 도구로 분석하는 구성을 채택했습니다.

### 컨테이너 이미지 활용

- [[Docker 설치 (Ubuntu 24.04 LTS)|(참고) Docker 환경 구축]]


WebGoat는 DockerHub에서 **두 가지 이미지**를 제공하고 있습니다.
- [기본 이미지](https://hub.docker.com/r/webgoat/webgoat) (`webgoat/webgoat`): WebGoat 서버만 포함된 버전입니다.
- [데스크탑 이미지](https://hub.docker.com/r/webgoat/webgoat-desktop) (`webgoat/webgoat-desktop`): 공격 환경과 도구가 사전 준비된 통합 실습 환경입니다.

하나의 VM에서 다양한 웹 해킹 실습을 진행할 예정이기 때문에 **기본 이미지를 사용**합니다.

> [!code] 📒webgoat 로컬 컨테이너 실행 명령
> ``` sh
> # 초기 실행 방법
> # webgoat라는 이름으로 로컬 컨테이너 생성&실행
> docker run --name webgoat -it -p 8080:8080 -p 9090:9090 webgoat/webgoat
> 
> # 이후 실행 방법 
> # WebGoat라는 이름의 로컬 컨테이너 실행
> docker run webgoat
> ```

### 실행 결과

컨테이너 실행 이후, 출력되는 로그를 통해 각 서비스의 열린 경로를 확인할 수 있다.
 - WebWolf: `/WebWolf`
 - WebGoat: `/WebGoat`

![[Pasted image 20260128151801.png|800]]
*▲그림 1. WebWolf 컨테이너 실행 화면(CMD)*
![[Pasted image 20260128152628.png|800]]
*~~WebGoat는 로그가 더러워서 간소하게..~~*

VM 내부에서 Chrome 브라우저에 `http://localhost:8080/WebGoat`를 쳐서 WebGoat의 로그인 페이지에 접속할 수 있다. 
![[Pasted image 20260128142255.png|350]]
*▲그림 2. 브라우저 실행 결과(VM)*

---
### 추가 설정(VirtualBox 포트포워딩)

VM 내부에서는 올라온 서비스들에 접근이 가능했지만, 호스트에선 접근이 불가능하다.

![[Pasted image 20260128154113.png|350]]
*▲그림 3. 브라우저 실행 결과(Host)*

이를 해결하기 위해 VM에서 포트포워딩을 해줘야 한다.
⚠️ 이 글에선 VirtualBox를 기본으로 설정한다.

먼저, WebGoat가 실행하고 있는 가상 머신의 `설정`>`네트워크`>`포트포워딩`을 눌러 설정 화면에 접근한다.

![[Pasted image 20260128154414.png|650]]
*▲그림 4. VirtualBox 포트포워딩 설정(1)*

왼쪽 위의 규칙 추가 버튼을 눌러 규칙을 만들 행을 생성한다.

- WebGoat(Rule1)
	- Host IP: localhost
	- Host Port: 58080 (타 서비스와 중복 방지)
	- Guest IP: VM IP (그림 6 참고)
	- Guest Port: 8080 (webgoat 서비스 포트)

- WebWolf(Rule2)
	**Rule1과 동일한 이유**
 
![[Pasted image 20260128155308.png|650]]
*▲그림 5. VirtualBox 포트포워딩 설정(2)*

참고로 가상 머신의 IP는 가상 머신 내부에서 `ip addr` 명령을 통해 식별할 수 있다.

![[Pasted image 20260128154840.png|650]]
*▲그림 6. 가상 머신의 IP 확인(`ip addr`)*

### 찐 실행 결과

추가 세팅 이후 호스트에서도 접근이 잘된다.
⚠️주의: 포트포워딩한 포트로 접근해야 함! (58080, 59090)
![[Pasted image 20260128160720.png|400]]
*▲그림 7. 브라우저 실행 결과(Host)*

## Reference
https://github.com/WebGoat/WebGoat
https://owasp.org/www-project-webgoat/