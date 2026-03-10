---
title: 01_WebGoat - Chrome Devtools Bug 제보
draft: "true"
tags:
  - WebGoat
  - WebHacking
  - Docker
  - AutoEver
---
## [블로그 글 초안] WebGoat 404 에러 분석 및 오픈소스 기여기 (Docker vs Source 불일치)

### 제목 추천

- **WebGoat 404 에러 트러블슈팅: Docker 이미지와 소스코드가 다를 때 (오픈소스 기여)**
    
- **오픈소스 기여기: WebGoat 최신 버전의 Regression 버그를 잡다**
    
- **"왜 내 것만 안 돼?"로 시작해서 WebGoat 코드 기여까지**
    

---

### 1. 배경 (Intro)

웹 보안 공부를 위해 **WebGoat**를 Docker로 띄워서 실습하던 중이었습니다. 순조롭게 진행되나 싶었는데, **General > Developer Tools** 챕터의 6페이지(Network Lesson)에서 문제가 발생했습니다.

분명 시키는 대로 `Go!` 버튼을 눌렀는데, 아무 반응 없이 콘솔창에는 **404 (Not Found)** 에러만 뜨는 상황이었습니다.

### 2. 문제 분석 (Analysis)

#### 1) 현상 파악

개발자 도구(Network 탭)를 확인해보니, 브라우저는 다음과 같은 경로로 요청을 보내고 있었습니다.

- **Request URL:** `POST /WebGoat/chromeDevTools/network` (소문자 `c`)
    

하지만 서버(Spring Boot)가 404를 뱉는다는 건, 저 경로를 받는 컨트롤러가 없다는 뜻입니다.

#### 2) 소스코드 확인 (GitHub)

WebGoat의 GitHub 저장소를 확인해 보았습니다. `NetworkLesson.java` 파일을 보니, `@RequestMapping`은 **CamelCase(대문자 C)**로 정의되어 있었습니다.

Java

```
// NetworkLesson.java
@RequestMapping("/ChromeDevTools/network") // 대문자 C
```

"아, 그럼 HTML에서 오타가 났겠구나" 싶어서 HTML 파일도 확인했지만, **GitHub의 HTML 파일도 정상적으로 대문자**였습니다.

HTML

```
<form th:action="@{/ChromeDevTools/network}" ...>
```

> **의문점:** 코드는 정상인데, 왜 내 로컬(Docker)에서는 소문자로 요청을 보낼까?

#### 3) Docker 이미지 내부 까보기 (Deep Dive)

설마 하는 마음에 실행 중인 Docker 컨테이너에서 `webgoat.jar`를 추출하여 내부의 HTML 파일을 뜯어보았습니다.

Bash

```
docker cp <container_id>:/home/webgoat/webgoat.jar .
unzip -p webgoat.jar ".../ChromeDevTools.html" | grep action
```

**범인은 여기 있었습니다.** Docker 이미지 안에 패키징 된 HTML 파일은 **소문자(`chromeDevTools`)**로 되어 있었습니다. GitHub 소스코드와 실제 배포된 Artifact(Docker 이미지) 간의 **불일치(Mismatch)**가 발생한 것입니다.

#### 4) Regression 검증

이게 단순한 실수인지, 언제부터 잘못된 건지 확인하기 위해 과거 버전 태그들을 검사하는 스크립트를 짜서 돌려봤습니다.

- **v2023.x 버전:** 정상 (대문자)
    
- **v2025.x (최신):** 비정상 (소문자로 회귀)
    

빌드 파이프라인(CI/CD) 상에서 캐시 문제나 오래된 리소스가 섞여 들어가는 **Regression** 이슈로 판단되었습니다.

### 3. 해결 및 기여 (Contribution)

#### 해결 전략: Robustness (견고함)

가장 근본적인 해결책은 Docker 이미지를 다시 제대로 빌드하는 것이지만, 저는 외부 기여자이므로 빌드 시스템을 건드릴 권한이 없습니다. 대신, **코드 레벨에서 호환성을 챙기는(Backward Compatibility) 방법**으로 접근했습니다.

백엔드(Java)가 **대문자**와 **소문자** 요청을 모두 받아주도록 수정하면,

1. HTML이 잘못된(소문자) 현재 Docker 이미지에서도 작동하고
    
2. 나중에 HTML이 정상(대문자)으로 돌아와도 문제없이 작동합니다.
    

#### Pull Request 준비

이슈(Issue)를 상세히 작성하여 리포팅했고, 아래와 같이 코드를 수정하여 PR을 준비했습니다.

Java

```
// 기존 코드
// @RequestMapping("/ChromeDevTools/network")

// 수정 코드 (둘 다 허용)
@RequestMapping(path = {"/ChromeDevTools/network", "/chromeDevTools/network"})
```

### 4. 결론 및 느낀 점

단순히 "에러 나네?" 하고 넘어갈 수도 있었지만, **"Docker 내부 파일 확인"**과 **"버전별 비교"**를 통해 근본 원인이 **빌드 배포 과정의 문제**임을 찾아낼 수 있었습니다.

비록 빌드 설정을 직접 고칠 순 없어도, 코드 유연성을 높여 사용자의 불편을 해소하는 방식으로 기여할 수 있다는 점을 배웠습니다.

[GitHub Issue 링크](https://github.com/WebGoat/WebGoat/issues/2286)
