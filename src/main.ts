import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpAdapterHost } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from '@/common/filters/all-exception.filter';
import { LoggerService } from './common/logger/logger.service';
import helmet from 'helmet';
import { helmetConfig } from './common/config/security.config';
import { TransformInterceptor } from '@/common/interceptor/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new TransformInterceptor())
  
  // 获取日志服务实例
  const logger = app.get(LoggerService);
  
  // 获取 HttpAdapter
  const httpAdapter = app.get(HttpAdapterHost);

  // 注册全局异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter, logger));

  // 应用 Helmet 中间件
  app.use(helmet(helmetConfig));

  // 启用 CORS
  app.enableCors({
    origin: true, // 在生产环境中应该设置具体的域名
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 3600
  });

  const config = app.get(ConfigService);
  const port = config.get('PORT') ?? 3000;
  
  // 启动应用
  await app.listen(port);

  logger.log(`应用已启动，监听端口：${port}`, 'Bootstrap');
}

bootstrap().catch(err => {
  console.error('应用启动失败:', err);
  process.exit(1);
});
