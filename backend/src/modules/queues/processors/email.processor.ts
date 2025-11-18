import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { EmailService } from '../../notifications/email/email.service';

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly emailService: EmailService) {}

  @Process('send-email')
  async handleSendEmail(job: Job) {
    this.logger.log(`Processing email job ${job.id}`);
    const { to, subject, html, template, context } = job.data;

    try {
      await this.emailService.sendEmail({
        to,
        subject,
        html,
        template,
        context,
      });
      this.logger.log(`Email sent successfully for job ${job.id}`);
    } catch (error) {
      this.logger.error(`Failed to send email for job ${job.id}: ${error.message}`);
      throw error;
    }
  }

  @Process('send-bulk-email')
  async handleBulkEmail(job: Job) {
    this.logger.log(`Processing bulk email job ${job.id}`);
    const { recipients, subject, html } = job.data;

    try {
      const promises = recipients.map((to: string) =>
        this.emailService.sendEmail({ to, subject, html }),
      );
      await Promise.all(promises);
      this.logger.log(`Bulk emails sent successfully for job ${job.id}`);
    } catch (error) {
      this.logger.error(`Failed to send bulk emails for job ${job.id}: ${error.message}`);
      throw error;
    }
  }
}
