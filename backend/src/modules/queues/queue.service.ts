import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('email') private readonly emailQueue: Queue,
    @InjectQueue('sms') private readonly smsQueue: Queue,
    @InjectQueue('report') private readonly reportQueue: Queue,
  ) {}

  // Email queue operations
  async sendEmail(emailData: any, delay?: number) {
    return await this.emailQueue.add('send-email', emailData, {
      delay,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
  }

  async sendBulkEmail(emailData: any) {
    return await this.emailQueue.add('send-bulk-email', emailData, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
  }

  // SMS queue operations
  async sendSms(smsData: any, delay?: number) {
    return await this.smsQueue.add('send-sms', smsData, {
      delay,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
  }

  async sendBulkSms(smsData: any) {
    return await this.smsQueue.add('send-bulk-sms', smsData, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
  }

  // Report generation queue operations
  async generateReportCard(data: any) {
    return await this.reportQueue.add('generate-report-card', data, {
      attempts: 2,
    });
  }

  async generateFeeReceipt(data: any) {
    return await this.reportQueue.add('generate-fee-receipt', data, {
      attempts: 2,
    });
  }

  async generateSalarySlip(data: any) {
    return await this.reportQueue.add('generate-salary-slip', data, {
      attempts: 2,
    });
  }

  async generateAttendanceReport(data: any) {
    return await this.reportQueue.add('generate-attendance-report', data, {
      attempts: 2,
    });
  }

  // Queue monitoring
  async getEmailQueueStats() {
    return {
      waiting: await this.emailQueue.getWaitingCount(),
      active: await this.emailQueue.getActiveCount(),
      completed: await this.emailQueue.getCompletedCount(),
      failed: await this.emailQueue.getFailedCount(),
      delayed: await this.emailQueue.getDelayedCount(),
    };
  }

  async getSmsQueueStats() {
    return {
      waiting: await this.smsQueue.getWaitingCount(),
      active: await this.smsQueue.getActiveCount(),
      completed: await this.smsQueue.getCompletedCount(),
      failed: await this.smsQueue.getFailedCount(),
      delayed: await this.smsQueue.getDelayedCount(),
    };
  }

  async getReportQueueStats() {
    return {
      waiting: await this.reportQueue.getWaitingCount(),
      active: await this.reportQueue.getActiveCount(),
      completed: await this.reportQueue.getCompletedCount(),
      failed: await this.reportQueue.getFailedCount(),
      delayed: await this.reportQueue.getDelayedCount(),
    };
  }
}
