#!/bin/bash
# Docling Web 部署脚本
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "=== Docling Web 部署脚本 ==="
echo "工作目录: $SCRIPT_DIR"

echo "[1/3] 加载 Docker 镜像..."
docker load -i "$SCRIPT_DIR/docling-frontend.tar"
docker load -i "$SCRIPT_DIR/docling-backend.tar"

echo "[2/3] 停止旧容器（如有）..."
docker compose -f "$SCRIPT_DIR/docker-compose.yml" down 2>/dev/null || true

echo "[3/3] 启动服务..."
docker compose -f "$SCRIPT_DIR/docker-compose.yml" up -d

echo "=== 部署完成！==="
echo "前端访问地址: http://$(hostname -I | awk '{print $1}'):8080"
echo "查看日志: docker compose -f $SCRIPT_DIR/docker-compose.yml logs -f"
