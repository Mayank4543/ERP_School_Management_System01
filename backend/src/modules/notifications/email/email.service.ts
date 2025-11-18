import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  template?: string;
  context?: any;
  html?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: Buffer | string;
  }>;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: options.to,
        subject: options.subject,
        template: options.template,
        context: options.context,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
      });

      this.logger.log(`Email sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      return false;
    }
  }

  // Welcome email
  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Welcome to GegoK12 ERP',
      html: `
        <h1>Welcome ${name}!</h1>
        <p>Thank you for registering with GegoK12 School Management System.</p>
        <p>You can now log in to your account and start using the platform.</p>
      `,
    });
  }

  // Password reset email
  async sendPasswordResetEmail(
    email: string,
    name: string,
    resetToken: string,
  ): Promise<boolean> {
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}`;
    
    return this.sendEmail({
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h1>Hello ${name},</h1>
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
  }

  // Admission confirmation
  async sendAdmissionConfirmation(
    email: string,
    studentName: string,
    admissionNo: string,
    standard: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Admission Confirmation',
      html: `
        <h1>Admission Confirmed</h1>
        <p>Dear Parent/Guardian,</p>
        <p>We are pleased to inform you that <strong>${studentName}</strong> has been successfully admitted to our school.</p>
        <h3>Admission Details:</h3>
        <ul>
          <li>Admission Number: ${admissionNo}</li>
          <li>Standard: ${standard}</li>
        </ul>
        <p>Welcome to our school family!</p>
      `,
    });
  }

  // Fee payment confirmation
  async sendFeePaymentConfirmation(
    email: string,
    receiptNo: string,
    amount: number,
    paymentDate: Date,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Fee Payment Confirmation',
      html: `
        <h1>Payment Received</h1>
        <p>Thank you for your payment.</p>
        <h3>Payment Details:</h3>
        <ul>
          <li>Receipt Number: ${receiptNo}</li>
          <li>Amount: ₹${amount}</li>
          <li>Date: ${paymentDate.toLocaleDateString()}</li>
        </ul>
        <p>This is an automated confirmation email.</p>
      `,
    });
  }

  // Exam result notification
  async sendExamResultNotification(
    email: string,
    studentName: string,
    examName: string,
    totalMarks: number,
    obtainedMarks: number,
    percentage: number,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: `Exam Results - ${examName}`,
      html: `
        <h1>Exam Results Available</h1>
        <p>Dear Parent/Guardian,</p>
        <p>The results for <strong>${examName}</strong> are now available.</p>
        <h3>Result Summary for ${studentName}:</h3>
        <ul>
          <li>Total Marks: ${totalMarks}</li>
          <li>Obtained Marks: ${obtainedMarks}</li>
          <li>Percentage: ${percentage.toFixed(2)}%</li>
        </ul>
        <p>Please log in to view detailed subject-wise marks.</p>
      `,
    });
  }

  // Leave approval notification
  async sendLeaveStatusNotification(
    email: string,
    name: string,
    leaveType: string,
    status: string,
    reason?: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: `Leave Request ${status}`,
      html: `
        <h1>Leave Request Update</h1>
        <p>Dear ${name},</p>
        <p>Your leave request has been <strong>${status}</strong>.</p>
        <h3>Leave Details:</h3>
        <ul>
          <li>Leave Type: ${leaveType}</li>
          <li>Status: ${status}</li>
          ${reason ? `<li>Reason: ${reason}</li>` : ''}
        </ul>
      `,
    });
  }

  // Attendance alert (low attendance)
  async sendAttendanceAlert(
    email: string,
    studentName: string,
    attendancePercentage: number,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Low Attendance Alert',
      html: `
        <h1>Attendance Alert</h1>
        <p>Dear Parent/Guardian,</p>
        <p>This is to inform you that <strong>${studentName}</strong>'s attendance has fallen below the required threshold.</p>
        <p>Current Attendance: <strong>${attendancePercentage.toFixed(2)}%</strong></p>
        <p>Minimum Required: <strong>75%</strong></p>
        <p>Please ensure regular attendance.</p>
      `,
    });
  }

  // Notice/Announcement notification
  async sendNoticeNotification(
    emails: string[],
    title: string,
    description: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: emails,
      subject: `Notice: ${title}`,
      html: `
        <h1>${title}</h1>
        <p>${description}</p>
        <p>Please check the school portal for more details.</p>
      `,
    });
  }

  // Event reminder
  async sendEventReminder(
    emails: string[],
    eventName: string,
    eventDate: Date,
    venue: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: emails,
      subject: `Event Reminder: ${eventName}`,
      html: `
        <h1>Event Reminder</h1>
        <p>This is a reminder for the upcoming event:</p>
        <h3>Event Details:</h3>
        <ul>
          <li>Event: ${eventName}</li>
          <li>Date: ${eventDate.toLocaleDateString()}</li>
          <li>Time: ${eventDate.toLocaleTimeString()}</li>
          <li>Venue: ${venue}</li>
        </ul>
        <p>We look forward to your participation!</p>
      `,
    });
  }

  // Salary slip notification
  async sendSalarySlipNotification(
    email: string,
    employeeName: string,
    month: number,
    year: number,
    pdfPath?: string,
  ): Promise<boolean> {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return this.sendEmail({
      to: email,
      subject: `Salary Slip - ${monthNames[month - 1]} ${year}`,
      html: `
        <h1>Salary Slip</h1>
        <p>Dear ${employeeName},</p>
        <p>Your salary slip for ${monthNames[month - 1]} ${year} is ready.</p>
        <p>Please log in to the portal to view and download your salary slip.</p>
      `,
      attachments: pdfPath ? [{
        filename: `salary-slip-${month}-${year}.pdf`,
        path: pdfPath,
      }] : undefined,
    });
  }
}
