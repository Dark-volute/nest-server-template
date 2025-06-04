import { Controller, Get, Inject, BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggerService } from './common/logger/logger.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { PrismaService } from './prisma/prisma.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from '@/common/queue/mail.service';

@Controller()
export class AppController {
  constructor(
    // @InjectRedis() private readonly redis: Redis,
    // @InjectRepository(User) private userRepository: Repository<User>,
    private readonly appService: AppService,
    //private readonly logger: LoggerService,
    //private prisma: PrismaService,
    //private readonly mailService: MailService,
    
  ) {}

  @Get()
  async getHello(): Promise<string> {
    //this.mailService.sendMail('test@test.com', 'Test Subject', 'Test Body');
    // const users = await this.userRepository.find();
    // const users = await this.prisma.user.findMany();

    // const value = await this.redis.get('test');
    return this.appService.getHello();
  }

  @Get('health')
  async healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
      },
    };
  }
}
