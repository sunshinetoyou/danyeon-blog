---
title: 01_WebGoat - HTTP Proxies
tags:
  - WebGoat
  - WebHacking
  - AutoEver
draft: "true"
date: 2026-01-30
---
## Background

### Proxy

NIST 정의
"클라이언트와 서버의 연결을 부시는(breaks) 응용 프로그램"

### Loopback Proxy

---
## Tools

WebGoat에서는 두 가지 도구를 소개한다. ZAP와 Burp Suite이다.

~~여기선 Burp Suite만 세팅하고 문제를 푼다.~~


## 5. Intercept and modify a request

### Recon

![[Pasted image 20260129231144.png|650]]
*▲ 이번 장의 단 하나밖에 없는 문제*

아래의 버튼을 누르면 Request를 보내는데, 이를 인터셉트해서 요구사항에 맞게 변조해야 한다.

요구사항은 다음과 같다. 
- Request Method를 GET으로 변경
- 헤더에 x-request-intercepted:true 추가
- 바디는 삭제, 대신 쿼리(changeMe)에 Requests are tampered easily를 설정

### Analysis

패킷을 캡쳐하면, 다음과 같은 Request를 확인할 수 있다.
![[Pasted image 20260129231905.png]]
*▲ original Request*

1. **changeMe 값 변경**
	Post 요청에서 바디는 GET 요청의 쿼리로 변경된다.
	따라서, Method 변경 이전에 바디 값을 요구사항대로 수정하면 수고를 덜 수 있다.

![[Pasted image 20260129232121.png]]
*▲ changeMe의 값 변경*

2. **Method 변경**
![[Pasted image 20260129232507.png|650]]
*▲ Method 변경*

3. **헤더 요소 추가**
![[Pasted image 20260129232803.png|650]]
*▲ 헤더 추가*


### 실행 결과
![[Pasted image 20260129232902.png]]
*▲ Response*

![[Pasted image 20260129232941.png|650]]
*▲ Well done ╰(*°▽°*)╯*