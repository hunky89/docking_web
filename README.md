# Docling Web

文档解析与转换 Web 服务，前后端分离部署。

## 服务组成

| 服务 | 镜像 | 端口 |
|------|------|------|
| 前端 | docling-frontend:latest | 8080 |
| 后端 | docling-backend:latest | 内部 8000 |

## 部署方式

```bash
# 1. 加载镜像（tar 文件需单独获取）
docker load -i docling-frontend.tar
docker load -i docling-backend.tar

# 2. 启动服务
docker compose up -d
```

## 访问地址

- 前端：http://<服务器IP>:8080
