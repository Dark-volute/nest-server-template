import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MailProcessor } from './mail.processor';
import { MailService } from './mail.service';

@Module({
    imports: [
      BullModule.forRootAsync({
        useFactory: () => ({
          redis: {
            host: 'localhost',
            port: 6379,
          },
        }),
      }),
      BullModule.registerQueue({
        name: 'mailQueue',
      }),
    ],
    providers: [MailProcessor, MailService],
    exports: [MailService, MailProcessor],
  })
export class QueueModule {}
