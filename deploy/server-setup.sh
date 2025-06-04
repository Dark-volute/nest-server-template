#!/bin/bash

# 服务器初始化脚本
# 在服务器上运行此脚本来设置部署环境

set -e

echo "开始设置服务器部署环境..."

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
mkdir -p logs nginx/ssl mysql/init

# 下载配置文件
echo "下载配置文件..."
curl -o docker-compose.yml https://raw.githubusercontent.com/your-username/nest-api/main/docker-compose.prod.yml
curl -o nginx/nginx.conf https://raw.githubusercontent.com/your-username/nest-api/main/nginx/nginx.conf

# 创建环境变量文件
cat > .env << EOF
# 数据库配置
DATABASE_URL=mysql://nest_user:$(openssl rand -base64 32)@mysql:3306/nest_db
MYSQL_ROOT_PASSWORD=$(openssl rand -base64 32)
MYSQL_DATABASE=nest_db
MYSQL_USER=nest_user
MYSQL_PASSWORD=$(openssl rand -base64 32)

# Redis 配置
REDIS_URL=redis://redis:6379

# JWT 配置
JWT_SECRET=$(openssl rand -base64 64)

# 应用配置
NODE_ENV=production
PORT=3000

# 其他配置
LOG_LEVEL=info
EOF

echo "服务器环境设置完成！"
echo "请编辑 .env 文件设置正确的环境变量"
echo "请将 SSL 证书放置在 nginx/ssl/ 目录下"
echo "然后运行: docker-compose up -d" 