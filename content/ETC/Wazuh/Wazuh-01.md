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

이 부분에 대해서, 빨간 점끼리 통신을 해야 되는데, VPC 간에 10.x.x.x의 내부 IP를 사용해서 연결하는 것이 필요하다. (보안 상의 이유+Agent 등록)

본래 VPC 간의 통신은 인터넷을 통해 이뤄지지만, VPC Peering을 통해 서로 비밀스러운 통신이 가능하다.

이를 위해 총 3단계의 작업이 필요하다.
```
sudo /var/ossec/bin/agent-auth -m 10.1.101.167

```
# Reference
- AWS VPC Peering: https://docs.aws.amazon.com/ko_kr/vpc/latest/peering/what-is-vpc-peering.html

