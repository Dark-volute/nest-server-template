#!/bin/bash

# 简化版快速部署脚本
# 用于快速设置 GitHub Actions 自动化部署（只部署应用）

set -e

echo "🚀 NestJS 简化版自动化部署配置向导"
echo "===================================="

# 检查必要的工具
check_requirements() {
    echo "检查必要工具..."
    
    if ! command -v git &> /dev/null; then
        echo "❌ Git 未安装，请先安装 Git"
        exit 1
    fi
    
    echo "✅ 工具检查完成"
}

# 收集用户信息
collect_info() {
    echo ""
    echo "请提供以下信息："
    
    read -p "Docker Hub 用户名: " DOCKER_USERNAME
    read -p "GitHub 仓库名 (例: your-username/nest-api): " GITHUB_REPO
    read -p "服务器 IP 地址: " SERVER_HOST
    read -p "服务器用户名 (默认: root): " SERVER_USER
    SERVER_USER=${SERVER_USER:-root}
    read -p "SSH 端口 (默认: 22): " SERVER_PORT
    SERVER_PORT=${SERVER_PORT:-22}
    
    echo ""
    echo "配置信息确认："
    echo "Docker Hub 用户名: $DOCKER_USERNAME"
    echo "GitHub 仓库: $GITHUB_REPO"
    echo "服务器地址: $SERVER_HOST:$SERVER_PORT"
    echo "服务器用户: $SERVER_USER"
    
    read -p "确认以上信息正确吗？(y/N): " CONFIRM
    if [[ $CONFIRM != [yY] ]]; then
        echo "已取消配置"
        exit 0
    fi
}

# 更新配置文件
update_configs() {
    echo ""
    echo "更新配置文件..."
    
    # 更新 GitHub Actions 配置
    if [ -f ".github/workflows/deploy.yml" ]; then
        sed -i.bak "s/your-dockerhub-username/$DOCKER_USERNAME/g" .github/workflows/deploy.yml
        echo "✅ 已更新 GitHub Actions 配置"
    fi
    
    # 更新 Docker Compose 配置
    if [ -f "docker-compose.simple.yml" ]; then
        sed -i.bak "s/your-dockerhub-username/$DOCKER_USERNAME/g" docker-compose.simple.yml
        echo "✅ 已更新 Docker Compose 配置"
    fi
    
    # 更新服务器设置脚本
    if [ -f "deploy/server-setup-simple.sh" ]; then
        sed -i.bak "s/your-username/${GITHUB_REPO%/*}/g" deploy/server-setup-simple.sh
        echo "✅ 已更新服务器设置脚本"
    fi
}

# 生成 SSH 密钥（如果不存在）
generate_ssh_key() {
    echo ""
    echo "检查 SSH 密钥..."
    
    if [ ! -f ~/.ssh/id_rsa ]; then
        echo "生成新的 SSH 密钥..."
        ssh-keygen -t rsa -b 4096 -C "deploy@$(hostname)" -f ~/.ssh/id_rsa -N ""
        echo "✅ SSH 密钥已生成"
    else
        echo "✅ SSH 密钥已存在"
    fi
    
    echo ""
    echo "请将以下公钥添加到服务器的 ~/.ssh/authorized_keys 文件中："
    echo "----------------------------------------"
    cat ~/.ssh/id_rsa.pub
    echo "----------------------------------------"
    
    echo ""
    echo "在服务器上运行以下命令："
    echo "mkdir -p ~/.ssh"
    echo "echo '$(cat ~/.ssh/id_rsa.pub)' >> ~/.ssh/authorized_keys"
    echo "chmod 600 ~/.ssh/authorized_keys"
    echo "chmod 700 ~/.ssh"
    
    read -p "按回车键继续..."
}

# 显示 GitHub Secrets 配置
show_github_secrets() {
    echo ""
    echo "🔐 GitHub Secrets 配置"
    echo "======================"
    echo "请在 GitHub 仓库中设置以下 Secrets："
    echo "Settings → Secrets and variables → Actions → New repository secret"
    echo ""
    echo "DOCKER_USERNAME = $DOCKER_USERNAME"
    echo "DOCKER_PASSWORD = [你的 Docker Hub 密码或访问令牌]"
    echo "SERVER_HOST = $SERVER_HOST"
    echo "SERVER_USER = $SERVER_USER"
    echo "SERVER_PORT = $SERVER_PORT"
    echo "SERVER_SSH_KEY = [复制下面的私钥内容]"
    echo ""
    echo "SSH 私钥内容："
    echo "----------------------------------------"
    cat ~/.ssh/id_rsa
    echo "----------------------------------------"
}

# 生成服务器部署命令
generate_server_commands() {
    echo ""
    echo "🖥️  服务器部署命令"
    echo "=================="
    echo "在服务器上运行以下命令来设置部署环境："
    echo ""
    echo "# 下载并运行设置脚本"
    echo "curl -o setup.sh https://raw.githubusercontent.com/$GITHUB_REPO/main/deploy/server-setup-simple.sh"
    echo "chmod +x setup.sh"
    echo "./setup.sh"
    echo ""
    echo "# 或者手动设置"
    echo "sudo mkdir -p /opt/nest-api"
    echo "sudo chown \$USER:\$USER /opt/nest-api"
    echo "cd /opt/nest-api"
    echo ""
    echo "# 下载配置文件"
    echo "curl -o docker-compose.simple.yml https://raw.githubusercontent.com/$GITHUB_REPO/main/docker-compose.simple.yml"
    echo ""
    echo "# 创建环境变量文件"
    echo "echo 'JWT_SECRET=your-jwt-secret' > .env"
    echo "echo 'NODE_ENV=production' >> .env"
    echo "echo 'PORT=3000' >> .env"
}

# 显示后续步骤
show_next_steps() {
    echo ""
    echo "🎉 配置完成！"
    echo "============"
    echo ""
    echo "后续步骤："
    echo "1. 提交并推送代码到 GitHub"
    echo "2. 在 GitHub 中配置 Secrets"
    echo "3. 在服务器上运行部署命令"
    echo "4. 推送代码到 main 分支触发自动部署"
    echo ""
    echo "有用的命令："
    echo "- 查看部署日志: docker-compose -f docker-compose.simple.yml logs -f"
    echo "- 重启服务: docker-compose -f docker-compose.simple.yml restart"
    echo "- 查看服务状态: docker-compose -f docker-compose.simple.yml ps"
    echo "- 停止服务: docker-compose -f docker-compose.simple.yml down"
    echo ""
    echo "访问应用: http://$SERVER_HOST:3000"
    echo "健康检查: http://$SERVER_HOST:3000/health"
    echo ""
    echo "注意：此配置只部署应用本身，不包含数据库和 Nginx"
}

# 主函数
main() {
    check_requirements
    collect_info
    update_configs
    generate_ssh_key
    show_github_secrets
    generate_server_commands
    show_next_steps
}

# 运行主函数
main 