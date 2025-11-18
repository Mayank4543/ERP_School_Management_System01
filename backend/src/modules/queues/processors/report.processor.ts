import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { PdfService } from '../../reports/pdf/pdf.service';

@Processor('report')
export class ReportProcessor {
  private readonly logger = new Logger(ReportProcessor.name);

  constructor(private readonly pdfService: PdfService) {}

  @Process('generate-report-card')
  async handleReportCard(job: Job) {
    this.logger.log(`Generating report card for job ${job.id}`);
    const { studentData, examResults } = job.data;

    try {
      const filepath = await this.pdfService.generateReportCard(studentData, examResults);
      this.logger.log(`Report card generated: ${filepath}`);
      return { filepath };
    } catch (error) {
      this.logger.error(`Failed to generate report card: ${error.message}`);
      throw error;
    }
  }

  @Process('generate-fee-receipt')
  async handleFeeReceipt(job: Job) {
    this.logger.log(`Generating fee receipt for job ${job.id}`);
    const { receiptData } = job.data;

    try {
      const filepath = await this.pdfService.generateFeeReceipt(receiptData);
      this.logger.log(`Fee receipt generated: ${filepath}`);
      return { filepath };
    } catch (error) {
      this.logger.error(`Failed to generate fee receipt: ${error.message}`);
      throw error;
    }
  }

  @Process('generate-salary-slip')
  async handleSalarySlip(job: Job) {
    this.logger.log(`Generating salary slip for job ${job.id}`);
    const { payrollData } = job.data;

    try {
      const filepath = await this.pdfService.generateSalarySlip(payrollData);
      this.logger.log(`Salary slip generated: ${filepath}`);
      return { filepath };
    } catch (error) {
      this.logger.error(`Failed to generate salary slip: ${error.message}`);
      throw error;
    }
  }

  @Process('generate-attendance-report')
  async handleAttendanceReport(job: Job) {
    this.logger.log(`Generating attendance report for job ${job.id}`);
    const { reportData, attendanceRecords } = job.data;

    try {
      const filepath = await this.pdfService.generateAttendanceReport(reportData, attendanceRecords);
      this.logger.log(`Attendance report generated: ${filepath}`);
      return { filepath };
    } catch (error) {
      this.logger.error(`Failed to generate attendance report: ${error.message}`);
      throw error;
    }
  }
}
