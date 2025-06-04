# 自动化部署指南

本指南将帮助你设置通过 GitHub Actions 自动部署 NestJS 应用到服务器的完整流程。

## 🚀 部署架构

```
GitHub Repository → GitHub Actions → Docker Hub → 服务器 → Docker Compose
```

## 📋 前置要求

1. **GitHub 仓库**：你的 NestJS 项目已推送到 GitHub
2. **Docker Hub 账号**：用于存储 Docker 镜像
3. **服务器**：Linux 服务器（推荐 Ubuntu 20.04+）
4. **域名**（可选）：用于 HTTPS 配置

## 🔧 配置步骤

### 1. 配置 GitHub Secrets

在你的 GitHub 仓库中，进入 `Settings` → `Secrets and variables` → `Actions`，添加以下 secrets：

```
DOCKER_USERNAME=你的DockerHub用户名
DOCKER_PASSWORD=你的DockerHub密码或访问令牌
SERVER_HOST=服务器IP地址
SERVER_USER=服务器用户名
SERVER_SSH_KEY=服务器SSH私钥
SERVER_PORT=SSH端口（默认22）
```

### 2. 修改配置文件

#### 更新 GitHub Actions 配置

编辑 `.github/workflows/deploy.yml`：

```yaml
env:
  DOCKER_IMAGE: 你的DockerHub用户名/nest-api  # 修改这里
```

#### 更新 Docker Compose 配置

编辑 `docker-compose.prod.yml`：

```yaml
services:
  app:
    image: 你的DockerHub用户名/nest-api:latest  # 修改这里
```

#### 更新 Nginx 配置

编辑 `nginx/nginx.conf`：

```nginx
server_name your-domain.com;  # 修改为你的域名
```

### 3. 服务器设置

#### 方法一：使用自动化脚本

在服务器上运行：

```bash
# 下载并运行设置脚本
curl -o setup.sh https://raw.githubusercontent.com/你的用户名/nest-api/main/deploy/server-setup.sh
chmod +x setup.sh
./setup.sh
```

#### 方法二：手动设置

1. **安装 Docker 和 Docker Compose**

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

2. **创建项目目录**

```bash
sudo mkdir -p /opt/nest-api
sudo chown $USER:$USER /opt/nest-api
cd /opt/nest-api
```

3. **创建配置文件**

```bash
# 创建目录结构
mkdir -p logs nginx/ssl mysql/init

# 下载配置文件
curl -o docker-compose.yml https://raw.githubusercontent.com/你的用户名/nest-api/main/docker-compose.prod.yml
curl -o nginx/nginx.conf https://raw.githubusercontent.com/你的用户名/nest-api/main/nginx/nginx.conf
```

4. **配置环境变量**

创建 `.env` 文件：

```bash
cat > .env << EOF
# 数据库配置
DATABASE_URL=mysql://nest_user:强密码@mysql:3306/nest_db
MYSQL_ROOT_PASSWORD=强密码
MYSQL_DATABASE=nest_db
MYSQL_USER=nest_user
MYSQL_PASSWORD=强密码

# Redis 配置
REDIS_URL=redis://redis:6379

# JWT 配置
JWT_SECRET=你的JWT密钥

# 应用配置
NODE_ENV=production
PORT=3000

# 其他配置
LOG_LEVEL=info
EOF
```

### 4. SSL 证书配置（可选）

如果你有域名，可以配置 HTTPS：

1. **使用 Let's Encrypt**

```bash
# 安装 certbot
sudo apt install certbot

# 获取证书
sudo certbot certonly --standalone -d your-domain.com

# 复制证书到项目目录
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /opt/nest-api/nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem /opt/nest-api/nginx/ssl/key.pem
sudo chown $USER:$USER /opt/nest-api/nginx/ssl/*
```

2. **自签名证书（仅用于测试）**

```bash
cd /opt/nest-api/nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout key.pem -out cert.pem
```

### 5. 启动服务

```bash
cd /opt/nest-api
docker-compose up -d
```

## 🔄 部署流程

1. **推送代码到 main 分支**
2. **GitHub Actions 自动触发**：
   - 运行测试
   - 构建 Docker 镜像
   - 推送到 Docker Hub
   - SSH 到服务器部署

3. **服务器自动更新**：
   - 拉取最新镜像
   - 重启容器
   - 清理旧镜像

## 📊 监控和维护

### 查看日志

```bash
# 查看应用日志
docker-compose logs -f app

# 查看所有服务日志
docker-compose logs -f

# 查看 Nginx 日志
docker-compose logs -f nginx
```

### 健康检查

访问 `https://your-domain.com/health` 检查应用状态。

### 备份数据库

```bash
# 创建数据库备份
docker-compose exec mysql mysqldump -u root -p nest_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 更新应用

推送代码到 main 分支即可自动更新，或手动更新：

```bash
cd /opt/nest-api
docker-compose pull
docker-compose up -d
docker image prune -f
```

## 🛠️ 故障排除

### 常见问题

1. **容器启动失败**
   - 检查环境变量配置
   - 查看容器日志：`docker-compose logs app`

2. **数据库连接失败**
   - 确认数据库服务正常：`docker-compose ps`
   - 检查数据库配置和密码

3. **SSL 证书问题**
   - 确认证书文件存在且权限正确
   - 检查域名解析

4. **GitHub Actions 失败**
   - 检查 Secrets 配置
   - 查看 Actions 日志

### 有用的命令

```bash
# 查看运行中的容器
docker-compose ps

# 重启特定服务
docker-compose restart app

# 查看资源使用情况
docker stats

# 进入容器调试
docker-compose exec app sh
```

## 🔒 安全建议

1. **定期更新系统和 Docker**
2. **使用强密码和密钥**
3. **配置防火墙规则**
4. **定期备份数据**
5. **监控日志和异常**

## 📝 注意事项

- 确保服务器有足够的资源（至少 2GB RAM）
- 定期清理 Docker 镜像和容器
- 监控磁盘空间使用情况
- 设置日志轮转避免日志文件过大 