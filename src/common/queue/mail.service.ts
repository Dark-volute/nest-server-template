import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class MailService {
  constructor(@InjectQueue('mailQueue') private readonly mailQueue: Queue) {}

  async sendMail(to: string, subject: string, body: string) {
    await this.mailQueue.add('sendMailJob', { to, subject, body });
  }
}