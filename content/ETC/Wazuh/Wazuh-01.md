---
title: "[wazuh] AWS 설치부터 agent 연결까지"
draft: "true"
---
# 학습 배경
(생략)

# Wazuh All-in-one (w. AWS marketplace)
AWS market에서 Wazuh AIN AMI를 배포하고 있다.
(https://aws.amazon.com/marketplace/pp/prodview-eju4flv5eqmgq)

# Wazuh DashBoard

```bash
ssh -i [key.pem] -L 4443:[wazuh IP]:443 [user]@[agent IP]
```

![[Pasted image 20260313171813.png]]
*▲ localhost:4443 접속하면 나오는 메인 페이지*

# Agent 연결

### Trouble Shooting

서로 다른 VPC 간에 Private IP 를 통한 통신이 불가능했다.

이를 해결하고자 VPC Peering를 통해 서로 접근이 가능하게 만들었다.

#### 문제 정의

![[Pasted image 20260313172726.png]]

이 부분에 대해서, 빨간 점끼리 통신을 해야 되는데, 