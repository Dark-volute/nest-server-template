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

WORKDIR /app

# 复制 package.json 和 yarn.lock
COPY package.json yarn.lock ./

# 只安装生产依赖
RUN yarn install --frozen-lockfile --production

# 从构建阶段复制编译后的代码
COPY --from=builder /app/dist ./dist

# 设置环境变量
ENV NODE_ENV production
ENV PORT 3000

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "dist/main.js"] 