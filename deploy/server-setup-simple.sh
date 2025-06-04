#!/bin/bash

# 简化版服务器初始化脚本
# 只部署 NestJS 应用，不包含数据库和 Nginx

set -e

echo "开始设置服务器部署环境（简化版）..."

# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Docker
if ! command -v docker &> /dev/null; then
    echo "安装 Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

# 安装 Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "安装 Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# 创建项目目录
sudo mkdir -p /opt/nest-api
sudo chown $USER:$USER /opt/nest-api
cd /opt/nest-api

# 创建必要的目录
mkdir -p logs

# 下载配置文件
echo "下载配置文件..."
curl -o docker-compose.simple.yml https://raw.githubusercontent.com/your-username/nest-api/main/docker-compose.simple.yml

# 创建环境变量文件
cat > .env << EOF
# JWT 配置
JWT_SECRET=$(openssl rand -base64 64)

# 应用配置
NODE_ENV=production
PORT=3000

# 其他配置
LOG_LEVEL=info
EOF

echo "服务器环境设置完成！"
echo "配置文件已下载到当前目录"
echo "环境变量已生成到 .env 文件"
echo ""
echo "启动应用："
echo "docker-compose -f docker-compose.simple.yml up -d"
echo ""
echo "查看日志："
echo "docker-compose -f docker-compose.simple.yml logs -f"
echo ""
echo "停止应用："
echo "docker-compose -f docker-compose.simple.yml down" 