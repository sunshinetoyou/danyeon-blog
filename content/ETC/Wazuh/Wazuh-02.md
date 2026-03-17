---
draft: "true"
title: "[wazuh] Wazuh Agent 내부 컨테이너 로그 수집"
---
## Agent 설치 명령어 모음

```bash
# curl 명령 (RPM)
curl -o wazuh-agent-4.14.3-1.x86_64.rpm https://packages.wazuh.com/4.x/yum/wazuh-agent-4.14.3-1.x86_64.rpm && sudo WAZUH_MANAGER=[wazuh IP] WAZUH_AGENT_NAME=[Agengt-name] rpm -ihv wazuh-agent-4.14.3-1.x86_64.rpm

# curl 명령 (DEB)
curl -o wazuh-agent-4.14.3-1.x86_64.rpm https://packages.wazuh.com/4.x/yum/wazuh-agent-4.14.3-1.x86_64.rpm && sudo WAZUH_MANAGER='10.1.101.167' WAZUH_AGENT_NAME='vul-agent' rpm -ihv wazuh-agent-4.14.3-1.x86_64.rpm

# 서비스 재시작
sudo systemctl daemon-reload 
sudo systemctl enable wazuh-agent 
sudo systemctl start wazuh-agent

```


계정명: root / wazuh-user


