import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { SmsService } from '../../notifications/sms/sms.service';

@Processor('sms')
export class SmsProcessor {
  private readonly logger = new Logger(SmsProcessor.name);

  constructor(private readonly smsService: SmsService) {}

  @Process('send-sms')
  async handleSendSms(job: Job) {
    this.logger.log(`Processing SMS job ${job.id}`);
    const { to, message } = job.data;

    try {
      await this.smsService.sendSms({ to, message });
      this.logger.log(`SMS sent successfully for job ${job.id}`);
    } catch (error) {
      this.logger.error(`Failed to send SMS for job ${job.id}: ${error.message}`);
      throw error;
    }
  }

  @Process('send-bulk-sms')
  async handleBulkSms(job: Job) {
    this.logger.log(`Processing bulk SMS job ${job.id}`);
    const { recipients, message } = job.data;

    try {
      await this.smsService.sendSms({ to: recipients, message });
      this.logger.log(`Bulk SMS sent successfully for job ${job.id}`);
    } catch (error) {
      this.logger.error(`Failed to send bulk SMS for job ${job.id}: ${error.message}`);
      throw error;
    }
  }
}
