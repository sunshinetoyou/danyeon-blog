---
title: Rocky Golden VM 제작 과정
draft: "false"
tags:
  - AutoEver
  - VMware
  - Rocky_Linux
---

# 1. 패키지 설치 

``` bash
sudo dnf install -y epel-release
sudo dnf install -y ansible python3-pip sshpass tar git
pip3 install pywinrm pandas openpyxl
```

# 2. VScode Remote SSH 연결

`Remote-SSH` extension을 설치한다.

![[Pasted image 20260205015634.png]]
*`Remote - SSH` extention* 

왼쪽 하단의 버튼을 누르면 나오는 `Connect to Host..` 클릭 >> `+ Add New SSH Host` 클릭

![[Pasted image 20260205020010.png]]*Connect to Host..*

![[Pasted image 20260205020202.png]]
*Add New SSH Host...*

`ssh [유저명]@[원격 접속할 IP주소]` 를 입력한다.

![[Pasted image 20260205020342.png]]
*ssh 명령문 넣기*

엔터를 누르자.

![[Pasted image 20260205020503.png]]
*어디에 원격 접속 데이터 저장해둘 것인가*

추가되었으니, 다시 왼쪽 하단의 버튼을 눌러 추가된 IP 주소를 클릭한다.

# 3. Git 연결

vscode에 내장된 git 기능을 사용하자.

![[Pasted image 20260205020911.png]]

클론할 저장소를 입력하면 가져올 수 있다. 
어디에 받을지 선택은 각자 상황에 맞게 설정하면 된다.

![[Pasted image 20260205021048.png]]

![[Pasted image 20260205021259.png]]

# 4. ansible 실행하기

내부 스크립트(init) 실행
vm 켜놨어야 함.
