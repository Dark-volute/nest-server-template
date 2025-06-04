# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package.json 和 yarn.lock
COPY package.json yarn.lock ./

# 安装依赖
RUN yarn install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN yarn build

# 生产阶段
FROM node:20-alpine

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

WORKDIR /app

# 复制 package.json 和 yarn.lock
COPY package.json yarn.lock ./

# 只安装生产依赖
RUN yarn install --frozen-lockfile --production && \
    yarn cache clean

# 从构建阶段复制编译后的代码
COPY --from=builder /app/dist ./dist

# 复制环境变量文件（重要！）
COPY .env.production ./
COPY docker-compose.simple.yml ./

# 创建日志目录并设置权限
RUN mkdir -p logs && \
    chown -R nestjs:nodejs /app

# 切换到非 root 用户
USER nestjs

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# 启动应用
CMD ["npm", "run", "start:prod"]