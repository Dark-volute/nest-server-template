import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from './logger.service';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Global()
@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transports: [
          new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              winston.format.colorize(),
              winston.format.printf(
                ({ level, message, timestamp, ms, context }) =>
                  `${timestamp} ${context ? '[' + context + ']' : ''} ${level}: ${message} ${ms}`
              )
            ),
          }),
          new winston.transports.DailyRotateFile({
            filename: 'logs/%DATE%-error.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '2m',
            maxFiles: '7d',
            level: 'error',
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.json()
            )
          })
        ],
      }),
    }),
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {} 