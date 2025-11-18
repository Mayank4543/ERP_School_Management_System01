import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';

export interface SmsOptions {
  to: string | string[];
  message: string;
}

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private twilioClient: twilio.Twilio;

  constructor(private readonly configService: ConfigService) {
    const accountSid = this.configService.get<string>('sms.accountSid');
    const authToken = this.configService.get<string>('sms.authToken');

    if (+accountSid && authToken) {
      this.twilioClient = twilio(accountSid, authToken);
    } else {
      this.logger.warn('Twilio credentials not configured. SMS service disabled.');
    }
  }

  async sendSms(options: SmsOptions): Promise<boolean> {
    if (!this.twilioClient) {
      this.logger.error('Twilio client not initialized');
      return false;
    }

    try {
      const fromNumber = this.configService.get<string>('sms.phoneNumber');
      const recipients = Array.isArray(options.to) ? options.to : [options.to];

      const promises = recipients.map((to) =>
        this.twilioClient.messages.create({
          body: options.message,
          from: fromNumber,
          to: to,
        }),
      );

      await Promise.all(promises);
      this.logger.log(`SMS sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send SMS: ${error.message}`, error.stack);
      return false;
    }
  }

  // Admission confirmation SMS
  async sendAdmissionConfirmationSms(
    phoneNumber: string,
    studentName: string,
    admissionNo: string,
  ): Promise<boolean> {
    return this.sendSms({
      to: phoneNumber,
      message: `Dear Parent, ${studentName} has been successfully admitted. Admission No: ${admissionNo}. Welcome to our school! - GegoK12`,
    });
  }

  // Fee payment reminder
  async sendFeePaymentReminder(
    phoneNumber: string,
    studentName: string,
    amount: number,
    dueDate: Date,
  ): Promise<boolean> {
    return this.sendSms({
      to: phoneNumber,
      message: `Fee reminder for ${studentName}. Amount due: ₹${amount}. Due date: ${dueDate.toLocaleDateString()}. Please pay at the earliest. - GegoK12`,
    });
  }

  // Fee payment confirmation
  async sendFeePaymentConfirmationSms(
    phoneNumber: string,
    receiptNo: string,
    amount: number,
  ): Promise<boolean> {
    return this.sendSms({
      to: phoneNumber,
      message: `Payment received. Receipt No: ${receiptNo}, Amount: ₹${amount}. Thank you! - GegoK12`,
    });
  }

  // Attendance alert
  async sendAttendanceAlertSms(
    phoneNumber: string,
    studentName: string,
    date: Date,
  ): Promise<boolean> {
    return this.sendSms({
      to: phoneNumber,
      message: `${studentName} was absent on ${date.toLocaleDateString()}. Please ensure regular attendance. - GegoK12`,
    });
  }

  // Exam reminder
  async sendExamReminderSms(
    phoneNumbers: string[],
    examName: string,
    examDate: Date,
  ): Promise<boolean> {
    return this.sendSms({
      to: phoneNumbers,
      message: `Reminder: ${examName} scheduled on ${examDate.toLocaleDateString()}. Please prepare well. All the best! - GegoK12`,
    });
  }

  // Result published notification
  async sendResultPublishedSms(
    phoneNumber: string,
    studentName: string,
    examName: string,
  ): Promise<boolean> {
    return this.sendSms({
      to: phoneNumber,
      message: `${examName} results for ${studentName} are now available. Please log in to view. - GegoK12`,
    });
  }

  // Leave approval notification
  async sendLeaveStatusSms(
    phoneNumber: string,
    status: string,
    leaveType: string,
  ): Promise<boolean> {
    return this.sendSms({
      to: phoneNumber,
      message: `Your ${leaveType} leave request has been ${status}. - GegoK12`,
    });
  }

  // Emergency notification
  async sendEmergencyNotification(
    phoneNumbers: string[],
    message: string,
  ): Promise<boolean> {
    return this.sendSms({
      to: phoneNumbers,
      message: `URGENT: ${message} - GegoK12`,
    });
  }

  // Holiday notification
  async sendHolidayNotification(
    phoneNumbers: string[],
    eventName: string,
    date: Date,
  ): Promise<boolean> {
    return this.sendSms({
      to: phoneNumbers,
      message: `Holiday Notice: ${eventName} on ${date.toLocaleDateString()}. School will remain closed. - GegoK12`,
    });
  }

  // Meeting reminder for parents
  async sendParentMeetingReminder(
    phoneNumbers: string[],
    meetingDate: Date,
    venue: string,
  ): Promise<boolean> {
    return this.sendSms({
      to: phoneNumbers,
      message: `Parent-Teacher meeting on ${meetingDate.toLocaleDateString()} at ${venue}. Your presence is required. - GegoK12`,
    });
  }

  // OTP for verification
  async sendOtpSms(phoneNumber: string, otp: string): Promise<boolean> {
    return this.sendSms({
      to: phoneNumber,
      message: `Your OTP for verification is ${otp}. Valid for 10 minutes. Do not share with anyone. - GegoK12`,
    });
  }
}
