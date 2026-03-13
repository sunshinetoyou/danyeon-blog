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

```sh
ssh -i [key.pem] -L 4443:10.1.101.167:443 ec2-user@13.125.48.190
```

# Agent 연결