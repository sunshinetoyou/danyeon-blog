---
draft: "true"
title: "[wazuh] Wazuh Agent 내부 컨테이너 로그 수집"
---
## Agent 설치 명령어 모음

```bash
curl -o wazuh-agent-4.14.3-1.x86_64.rpm https://packages.wazuh.com/4.x/yum/wazuh-agent-4.14.3-1.x86_64.rpm && sudo WAZUH_MANAGER='10.3.1.112' WAZUH_AGENT_NAME='vul-agent' rpm -ihv wazuh-agent-4.14.3-1.x86_64.rpm
```


계정명: root / wazuh-user


