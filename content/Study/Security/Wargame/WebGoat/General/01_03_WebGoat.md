---
title: 01_WebGoat - Chrome Devtools (issue 포함)
tags:
  - WebGoat
  - WebHacking
  - AutoEver
draft: "true"
---
## 6 - Bug Intro

Docker에서 Developer Tools 페이지의 POST `/ChromeDevTools/network` request가 소문자(`/chrome...`)로 사용됨을 확인하였다.
## 6 - Details

![[Pasted image 20260130155012.png]]
*▲ `General`>`Developer Tools`>6 page*

Those two button coudn't work normally with 404 Error.

![[Pasted image 20260130154735.png]]
*▲ POST `/chromeDevTools/network` 404 Error*

내가 소스코드 분석해보니깐, 내부에 정의된 라우트는 `/ChromeDevTools/network` 인데, POST 요청을 보내는 경로는 `/chromeDevTools/network` 다.

이는 대소문자 구분에 따라 다른 경로로 취급하기에 에러가 나는 것으로 보인다.

![[Pasted image 20260130155940.png]]
*▲ `src\main\java\org\owasp\webgoat\lessons\chromedevtools\NetworkLesson.java`*

그래서 POST 요청을 보내는 곳을 수정하기 위해서 찾아봤는데, 정상적으로 대문자 요청을 보내고 있었다.
![[Pasted image 20260130160341.png]]
*▲ `src\main\resources\lessons\chromedevtools\html\ChromeDevTools.html`*

더군다나 `git blame`으로 확인해봤지만 별다른 수정기록을 확인할 수 없었다.
![[Pasted image 20260130160848.png]]
*▲ `git blame` result*

그래서 Docker(latest)에서 jar 파일을 가져와서 분석해보니깐, 소스코드와는 별개로 소문자 요청을 보내는 걸 확인할 수 있었다.
![[Pasted image 20260130144038.png]]
*▲ `src\main\resources\lessons\chromedevtools\html\ChromeDevTools.html` (in Docker)*

최종적으로, Docker 내부의 소스코드 문제인 걸 확인 후, 스크립트로 검사해보니 다음과 같은 결과를 확인할 수 있었다.
![[Pasted image 20260130161441.png]]
*▲ Script Result*
