import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validationSchema } from '@/common/config/validation.schema';
import { LoggerModule } from './common/logger/logger.module';
import { UserModule } from './user/user.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { PrismaModule } from './prisma/prisma.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { QueueModule } from '@/common/queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    // RedisModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => {
    //     const REDIS_PORT = configService.get('REDIS_PORT');
    //     return {
    //       type: 'single',
    //       url: `redis://localhost:${REDIS_PORT}`,
    //     }
    //   },
    // }),

    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => {
    //     const DATABASE_URL = configService.get('DATABASE_URL');
    //     return {
    //       type: 'mysql',
    //       port: 3306,
    //       username: 'nest_user',
    //       password: 'nest_password',
    //       database: 'nest_api',
    //       autoLoadEntities: true,
    //       synchronize: true,
    //     }
    //   }
    // }),
    // TypeOrmModule.forFeature([User]),
    LoggerModule,
    //PrismaModule,
    //AuthModule,
    //UserModule,
    // QueueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
