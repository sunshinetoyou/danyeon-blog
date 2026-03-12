---
draft: "true"
tags:
  - protocol
  - WebDAV
title: "[WebDAV] What is WebDAV"
---
## 학습 배경

주말동안 집에 나뒹구는 miniPC를 가져다가 간단한 홈 서버를 구축해봤다.<br>
도커 기반으로 서비스를 올리면서, 다중 기기에서 동기화된 작업을 위해 파일 서버를 하나 올려보려고 했다. 이전에 `Syncthing`을 사용해서 약 3개월 정도 사용해봤는데, 모르는 서버들을 경유하여 값이 전달되는 형식이 믿음직하지 않아서, 다른 서비스를 이용해보고자 했다.

그래서 찾은 `nextcloud`라는 서비스가 있었는데, 이 서비스는 파일을 공유하려면 WebDAV 서비스를 이용하라고 한다.

난생 처음 들어본.. 은 아니지만 제대로 학습해본 적은 없는 WebDAV 프로토콜에 대해 이해해보는 시간이 필요하다고 생각하여 학습을 진행한다.

\* 또한 NextCloud에서 사용하는 https://github.com/sabre-io/dav 서비스를 분석도 같이 해볼 생각이다.

## WebDAV (WEB Distributed Authoring and Versioning)

웹 개발자가 클라이언트에서 원격으로 콘텐츠를 수정, 버전 관리 할 수 있게 해주는 HTTP 확장 프로토콜이다. 하지만 WebDAV의 버전 관리 기능(DeltaV)는 복잡성 때문에 도태되어 현재 거의 사용되지 않는다.

WebDAV 프로토콜 단독으로 사용은 잘 하지 않지만, CalDAV(캘린더용), CardDAV(연락처용)으로 확장되어 사용되고 있다.[1]



## References
[1] https://developer.mozilla.org/en-US/docs/Glossary/WebDAV
[2] https://datatracker.ietf.org/doc/html/rfc4918
[3] https://datatracker.ietf.org/doc/html/rfc3744
[4]