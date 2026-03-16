---
draft: "true"
title: "[wazuh] Wazuh Agent 내부 컨테이너 로그 수집"
---
## Docker 로그 경로 수집

```sh
# 
sudo docker ps -aq --no-trunc

[ec2-user@ip-10-3-1-91 ~]$ sudo docker inspect --format='{{.LogPath}}' webgoat
/var/lib/docker/containers/aa1c2de88fb7de95765b59ebf7c952fb85bbedfc4f5c7b4bd28490883ed6f8ab/aa1c2de88fb7de95765b59ebf7c952fb85bbedfc4f5c7b4bd28490883ed6f8ab-json.log
```

