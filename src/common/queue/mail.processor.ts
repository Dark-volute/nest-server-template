import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('mailQueue')
export class MailProcessor {
  @Process('sendMailJob')
  async handleSendMailJob(job: Job<{ to: string; subject: string; body: string }>) {
    const { to, subject, body } = job.data;
    // 执行发送邮件的逻辑，例如使用 nodemailer
    console.log(`Sending mail to ${to} with subject: ${subject}`);
    // 在这里实际进行邮件发送操作
  }
}