---
title: common.sh 에 대한 고찰
---
# 배경

`common.sh`은 출력 결과를 JSON으로 포멧팅하기 위한 지원 함수들을 포함한 파일이었습니다.

하지만, ansible을 도입하면서 2가지 문제점을 확인할 수 있었습니다.

## 1. 경로 문제

![[Pasted image 20260205023818.png]]

이렇게 `srcript/` 폴더 내부에 `common.sh`와 `U-01.sh` 파일이 존재하는 상황입니다.

ansible은 진단 스크립트인 `U-01.sh` 파일을 `ansible/playbooks/run_script.sh`에서 실행합니다. 
이때, `U-01.sh` 파일 내부에서는 `common.sh`의 포멧팅 함수를 사용하고 있지만, 실행된 경로에서 `common.sh`파일을 찾을 수 없어서, 에러를 출력합니다.


## 2. JSON 출력을 하는 다른 방법

ansible에서 JSON 출력을 하는 방법이 있다고 들었음.
이는 추가 확인이 필요하며, 만약 ansible에서 표준 출력에 대해 json 포멧으로 변경할 수 있다면
진단 스크립트의 포멧을 대대적으로 변경하는 것이 앞으로 개발 진행에 더 도움이 될 것으로 사료됨.

