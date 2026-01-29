---
title: 01_WebGoat - HTTP Basics
tags:
  - WebGoat
  - WebHacking
  - AutoEver
draft: "true"
date: 2026-01-28
---
## OWASP Top 10

WebGoat는 OWASP Top 10 취약점을 실습할 수 있는 환경을 의도적으로 구현해 놓은 서비스이다.

따라서, OWASP Top 10 리스트에 대해서 학습한 이후, WebGoat로 실습하는 단계가 정석이다.

OWASP Top 10에 대한 정리는 [[OWASP TOP 10]]에 적어둘 예정.

%% ## 배경 지식(간단)

### Proxy

### Loopback Proxy

### Burp Suite %%


## WebGoat - HTTP Basics

%% 잡설이 길었다. 바로 실습으로 들어가자. %%
WebGoat 사이드 바에서 `General`>`HTTP Basics`를 실습한다.
### **Try it!**

#### Recon
![[Pasted image 20260129102554.png]]
*▲초기 상태*
입력값을 넣고, `Go!`를 눌러보면 역순으로 출력되는 것을 확인할 수 있다.

![[Pasted image 20260129102734.png]]
*▲출력 결과*
#### Analysis
간단히 Google Devtools로 해당 네트워크 패킷을 분석하고, 소스코드를 탐색해서 내부 작동 원리를 파악해보자.

![[Pasted image 20260129103100.png|650]]
*▲ 네트워크 패킷(Headers)

![[Pasted image 20260129103952.png|650]]
*▲/src/main/java/org/owasp/webgoat/lessons/httpbasics/HttpBasicsLesson.java*

---
### Quiz

#### Recon
![[Pasted image 20260129112439.png]]
*▲ Quiz 1, 2*

- 요청(req)의 type은 POST인가 GET인가?
- `magic number`의 값은?

<small>⚠️해당 로직은 위에서 확인한 /attack1 요청을 사용하지 않습니다.</small>
#### Analysis
devTools로 패킷을 분석해보면, Request Method가 `POST` 인 것을 확인할 수 있다.

![[Pasted image 20260129113046.png]]
*▲ `/attack2` 요청 식별*

또한, Payload에서 Requests 시에 같이 보내지는 데이터를 보면, 다음과 같이 `` 

![[Pasted image 20260129163716.png]]
*▲*

![[Pasted image 20260129105237.png]]
*▲ magic number 생성로직&값 확인*


## Reference
- [MDN-HTTP Messages](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages)
