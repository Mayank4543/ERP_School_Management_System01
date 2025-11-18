import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueService } from './queue.service';
import { EmailProcessor } from './processors/email.processor';
import { SmsProcessor } from './processors/sms.processor';
import { ReportProcessor } from './processors/report.processor';
import { EmailModule } from '../notifications/email/email.module';
import { SmsModule } from '../notifications/sms/sms.module';
import { PdfModule } from '../reports/pdf/pdf.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST') || 'localhost',
          port: configService.get<number>('REDIS_PORT') || 6379,
          password: configService.get<string>('REDIS_PASSWORD'),
        },
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 50,
        },
      }),
    }),
    BullModule.registerQueue(
      { name: 'email' },
      { name: 'sms' },
      { name: 'report' },
    ),
    EmailModule,
    SmsModule,
    PdfModule,
  ],
  providers: [QueueService, EmailProcessor, SmsProcessor, ReportProcessor],
  exports: [QueueService],
})
export class QueueModule {}
