# 仅需2步完成快速部署
## 1.前置条件
1. docker
2. docker-compose
3. 配置好docker镜像加速，注意国内（China）可能无法直接从docker hub拉取，需要拉取如下镜像:
  - pgvector/pgvector:pg16
  - redis:6.0
  - node:18.20.2
  - python:3.10-slim
  - nginx:latest

### 1.1 克隆代码
```shell
git clone https://github.com/tushengtao/gogollm.git
```

### 1.2 配置前端.env和后端.env
#### 前端.env,前端目录是ui
UMI_APP_BASE_URL是调用后端接口的地址，可以配置为部署服务器的有效ip或域名
```shell
UMI_APP_BASE_URL=http://{服务器有效ip}:9116
```
#### 后端.env,后端目录是backend
> 必须配置,如下：
```text
# llm config
OPENAI_API_BASE='https://xxx_host/v1'
OPENAI_API_KEY='sk-xxx'
```
如果需要测试代码远程执行，需要配置：
```text
# 远程代码执行地址PandoraBox
# PBOX_EXECUTE_TYPE loacl or remote
PBOX_EXECUTE_TYPE=remote
PBOX_REMOTE_API_KEY=pb-xxx
PBOX_REMOTE_URL=http://xxx:9501
```

## 2.部署
在quick_deploy目录下执行：
```shell
docker-compose up -d
```
