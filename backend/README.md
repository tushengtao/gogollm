# GoGoLLM Project - Backend

## 本地开发

* Python 3.10+
* pgvector:pg16+
* Redis 推荐最新稳定版

### 后端
1. 进入 `backend` 目录

   ```shell
   cd backend
   ```
2. 安装依赖包
   ```shell
   pip install -r requirements.txt
   ```
3. 创建一个数据库 `gogollm`，选择 utf8 编码
4. 安装并启动 Redis
5. 在 `backend` 目录下创建 `.env` 文件 ,按需修改文件`.env`
6. 执行 `main.py` 启动服务
7. 开发接口文档：http://127.0.0.1:9116/api/v1/docs

## 贡献
 Check out a new branch and make your changes
   ```shell
   # Checkout a new branch and make your changes
   git checkout -b your-new-feature-branch
   # Make your changes...
   ```
