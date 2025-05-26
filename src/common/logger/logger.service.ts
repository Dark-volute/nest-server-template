import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class LoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  log(message: string, context?: string, ...args: any[]) {
    this.logger.info(message, { context, ...args });
  }

  error(message: string, context?: string, trace?: string, ...args: any[]) {
    this.logger.error(message, { context, trace, ...args });
  }

  warn(message: string, context?: string, ...args: any[]) {
    this.logger.warn(message, { context, ...args });
  }

  debug(message: string, context?: string, ...args: any[]) {
    this.logger.debug(message, { context, ...args });
  }

  verbose(message: string, context?: string, ...args: any[]) {
    this.logger.verbose(message, { context, ...args });
  }

  // 记录HTTP请求日志
  logHttpRequest(req: any, context: string = 'HTTP') {
    this.logger.info('收到HTTP请求', {
      context,
      method: req.method,
      url: req.url,
      headers: req.headers,
      query: req.query,
      body: req.body,
    });
  }

  // 记录HTTP响应日志
  logHttpResponse(req: any, res: any, context: string = 'HTTP') {
    this.logger.info('HTTP响应完成', {
      context,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: res.responseTime,
    });
  }

  // 记录异常日志
  logException(exception: any, context: string = 'Exception') {
    this.logger.error('发生异常', {
      context,
      error: {
        name: exception instanceof Error ? exception.name : 'Unknown Error',
        message: exception instanceof Error ? exception.message : String(exception),
        stack: exception instanceof Error ? exception.stack : undefined,
      }
    });
  }
} 