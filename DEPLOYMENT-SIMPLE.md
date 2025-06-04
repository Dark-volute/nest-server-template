# 简化版自动化部署指南

本指南将帮助你设置通过 GitHub Actions 自动部署 NestJS 应用到服务器的流程（只部署应用本身，不包含数据库和 Nginx）。

## 🚀 部署架构

```
GitHub Repository → GitHub Actions → Docker Hub → 服务器 → Docker 容器
```

## 📋 前置要求

1. **GitHub 仓库**：你的 NestJS 项目已推送到 GitHub
2. **Docker Hub 账号**：用于存储 Docker 镜像
3. **服务器**：Linux 服务器（推荐 Ubuntu 20.04+）

## 🔧 快速开始

### 方法一：使用自动化脚本

运行快速配置脚本：

```bash
chmod +x scripts/quick-deploy-simple.sh
./scripts/quick-deploy-simple.sh
```

### 方法二：手动配置

#### 1. 配置 GitHub Secrets

在你的 GitHub 仓库中，进入 `Settings` → `Secrets and variables` → `Actions`，添加以下 secrets：

```
DOCKER_USERNAME=你的DockerHub用户名
DOCKER_PASSWORD=你的DockerHub密码或访问令牌
SERVER_HOST=服务器IP地址
SERVER_USER=服务器用户名
SERVER_SSH_KEY=服务器SSH私钥
SERVER_PORT=SSH端口（默认22）
```

#### 2. 修改配置文件

更新 `.github/workflows/deploy.yml` 中的 Docker 镜像名：

```yaml
env:
  DOCKER_IMAGE: 你的DockerHub用户名/nest-api  # 修改这里
```

更新 `docker-compose.simple.yml` 中的镜像名：

```yaml
services:
  app:
    image: 你的DockerHub用户名/nest-api:latest  # 修改这里
```

#### 3. 服务器设置

在服务器上运行：

```bash
# 下载并运行设置脚本
curl -o setup.sh https://raw.githubusercontent.com/你的用户名/nest-api/main/deploy/server-setup-simple.sh
chmod +x setup.sh
./setup.sh
```

或者手动设置：

```bash
# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 创建项目目录
sudo mkdir -p /opt/nest-api
sudo chown $USER:$USER /opt/nest-api
cd /opt/nest-api

# 下载配置文件
curl -o docker-compose.simple.yml https://raw.githubusercontent.com/你的用户名/nest-api/main/docker-compose.simple.yml

# 创建环境变量文件
cat > .env << EOF
JWT_SECRET=your-jwt-secret-here
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
EOF
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

## 📊 管理和维护

### 常用命令

```bash
# 查看应用状态
docker-compose -f docker-compose.simple.yml ps

# 查看应用日志
docker-compose -f docker-compose.simple.yml logs -f

# 重启应用
docker-compose -f docker-compose.simple.yml restart

# 停止应用
docker-compose -f docker-compose.simple.yml down

# 启动应用
docker-compose -f docker-compose.simple.yml up -d

# 更新应用（手动）
docker-compose -f docker-compose.simple.yml pull
docker-compose -f docker-compose.simple.yml up -d
```

### 健康检查

访问 `http://你的服务器IP:3000/health` 检查应用状态。

### 查看容器资源使用情况

```bash
docker stats nest-api-app
```

## 🛠️ 故障排除

### 常见问题

1. **容器启动失败**
   ```bash
   # 查看详细日志
   docker-compose -f docker-compose.simple.yml logs app
   
   # 检查容器状态
   docker-compose -f docker-compose.simple.yml ps
   ```

2. **端口被占用**
   ```bash
   # 查看端口占用情况
   sudo netstat -tlnp | grep :3000
   
   # 修改 docker-compose.simple.yml 中的端口映射
   ports:
     - "3001:3000"  # 改为其他端口
   ```

3. **GitHub Actions 失败**
   - 检查 GitHub Secrets 配置
   - 查看 Actions 日志
   - 确认 Docker Hub 凭据正确

4. **SSH 连接失败**
   - 检查服务器 SSH 配置
   - 确认 SSH 密钥格式正确
   - 检查防火墙设置

### 调试命令

```bash
# 进入容器调试
docker exec -it nest-api-app sh

# 查看容器详细信息
docker inspect nest-api-app

# 查看 Docker 系统信息
docker system df

# 清理未使用的资源
docker system prune -f
```

## 🔒 安全建议

1. **定期更新系统和 Docker**
2. **使用强密码和密钥**
3. **配置防火墙规则**
4. **定期备份应用数据**
5. **监控应用日志**

## 📝 注意事项

- 应用运行在端口 3000
- 日志文件存储在 `./logs` 目录
- 环境变量通过 `.env` 文件配置
- 容器会自动重启（除非手动停止）
- 包含健康检查，自动监控应用状态

## 🎯 下一步

如果需要添加数据库或 Nginx，可以参考完整版的部署指南 `DEPLOYMENT.md`。 