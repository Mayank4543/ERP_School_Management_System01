import { Injectable, Logger } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

export interface PdfOptions {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
}

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'pdfs');

  constructor() {
    // Create upload directory if it doesn't exist
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  private createDoc(options?: PdfOptions): PDFKit.PDFDocument {
    return new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      info: {
        Title: options?.title || 'Document',
        Author: options?.author || 'GegoK12 ERP',
        Subject: options?.subject,
        Keywords: options?.keywords,
      },
    });
  }

  private async savePdf(doc: PDFKit.PDFDocument, filename: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const filepath = path.join(this.uploadDir, filename);
      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);
      doc.end();

      stream.on('finish', () => {
        this.logger.log(`PDF saved: ${filepath}`);
        resolve(filepath);
      });

      stream.on('error', (error) => {
        this.logger.error(`PDF save error: ${error.message}`);
        reject(error);
      });
    });
  }

  // Generate student report card
  async generateReportCard(
    studentData: any,
    examResults: any[],
  ): Promise<string> {
    const doc = this.createDoc({
      title: `Report Card - ${studentData.name}`,
      subject: 'Student Report Card',
    });

    // Header
    doc
      .fontSize(20)
      .text('GegoK12 School Management System', { align: 'center' })
      .fontSize(16)
      .text('Student Report Card', { align: 'center' })
      .moveDown();

    // Student Details
    doc
      .fontSize(12)
      .text(`Name: ${studentData.name}`)
      .text(`Admission No: ${studentData.admission_no}`)
      .text(`Standard: ${studentData.standard}`)
      .text(`Section: ${studentData.section}`)
      .moveDown();

    // Exam Results Table
    doc.fontSize(14).text('Examination Results', { underline: true }).moveDown();

    const tableTop = doc.y;
    const tableHeaders = ['Subject', 'Max Marks', 'Obtained', 'Grade', 'Remarks'];
    const colWidths = [150, 80, 80, 60, 120];
    let currentX = 50;

    // Table Headers
    tableHeaders.forEach((header, i) => {
      doc.fontSize(10).text(header, currentX, tableTop, {
        width: colWidths[i],
        align: 'center',
      });
      currentX += colWidths[i];
    });

    doc.moveDown();

    // Table Rows
    examResults.forEach((result) => {
      const rowY = doc.y;
      currentX = 50;

      const rowData = [
        result.subject,
        result.max_marks.toString(),
        result.obtained_marks.toString(),
        result.grade,
        result.remarks || '-',
      ];

      rowData.forEach((data, i) => {
        doc.fontSize(9).text(data, currentX, rowY, {
          width: colWidths[i],
          align: 'center',
        });
        currentX += colWidths[i];
      });

      doc.moveDown();
    });

    // Summary
    doc.moveDown();
    const totalMarks = examResults.reduce((sum, r) => sum + r.max_marks, 0);
    const obtainedMarks = examResults.reduce((sum, r) => sum + r.obtained_marks, 0);
    const percentage = ((obtainedMarks / totalMarks) * 100).toFixed(2);

    doc
      .fontSize(12)
      .text(`Total Marks: ${totalMarks}`)
      .text(`Obtained Marks: ${obtainedMarks}`)
      .text(`Percentage: ${percentage}%`)
      .moveDown();

    // Footer
    doc
      .fontSize(10)
      .text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });

    const filename = `report-card-${studentData.admission_no}-${Date.now()}.pdf`;
    return await this.savePdf(doc, filename);
  }

  // Generate fee receipt
  async generateFeeReceipt(receiptData: any): Promise<string> {
    const doc = this.createDoc({
      title: `Fee Receipt - ${receiptData.receipt_no}`,
      subject: 'Fee Payment Receipt',
    });

    // Header
    doc
      .fontSize(20)
      .text('GegoK12 School', { align: 'center' })
      .fontSize(14)
      .text('Fee Payment Receipt', { align: 'center' })
      .moveDown(2);

    // Receipt Details
    doc
      .fontSize(12)
      .text(`Receipt No: ${receiptData.receipt_no}`)
      .text(`Date: ${new Date(receiptData.payment_date).toLocaleDateString()}`)
      .moveDown();

    doc
      .text(`Student Name: ${receiptData.student_name}`)
      .text(`Admission No: ${receiptData.admission_no}`)
      .text(`Standard: ${receiptData.standard}`)
      .text(`Section: ${receiptData.section}`)
      .moveDown(2);

    // Payment Details
    doc
      .fontSize(14)
      .text('Payment Details', { underline: true })
      .moveDown();

    doc
      .fontSize(12)
      .text(`Fee Type: ${receiptData.fee_type}`)
      .text(`Amount Paid: ₹${receiptData.amount}`)
      .text(`Payment Mode: ${receiptData.payment_mode}`)
      .text(`Transaction ID: ${receiptData.transaction_id || 'N/A'}`)
      .moveDown(3);

    // Signature
    doc
      .fontSize(10)
      .text('______________________', 80, doc.y, { width: 200 })
      .text('Authorized Signature', 80, doc.y, { width: 200 });

    const filename = `receipt-${receiptData.receipt_no}-${Date.now()}.pdf`;
    return await this.savePdf(doc, filename);
  }

  // Generate salary slip
  async generateSalarySlip(payrollData: any): Promise<string> {
    const doc = this.createDoc({
      title: `Salary Slip - ${payrollData.employee_name}`,
      subject: 'Salary Slip',
    });

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Header
    doc
      .fontSize(20)
      .text('GegoK12 School', { align: 'center' })
      .fontSize(14)
      .text('Salary Slip', { align: 'center' })
      .fontSize(12)
      .text(`${monthNames[payrollData.month - 1]} ${payrollData.year}`, { align: 'center' })
      .moveDown(2);

    // Employee Details
    doc
      .fontSize(12)
      .text(`Employee Name: ${payrollData.employee_name}`)
      .text(`Employee ID: ${payrollData.employee_id}`)
      .text(`Designation: ${payrollData.designation}`)
      .text(`Department: ${payrollData.department}`)
      .moveDown(2);

    // Earnings and Deductions
    const tableTop = doc.y;
    doc
      .fontSize(12)
      .text('Earnings', 80, tableTop)
      .text('Deductions', 320, tableTop)
      .moveDown();

    const earningsY = doc.y;
    doc
      .fontSize(10)
      .text(`Basic Salary: ₹${payrollData.basic_salary}`, 80)
      .text(`HRA: ₹${payrollData.allowances.hra}`, 80)
      .text(`DA: ₹${payrollData.allowances.da}`, 80)
      .text(`TA: ₹${payrollData.allowances.ta}`, 80)
      .text(`Medical: ₹${payrollData.allowances.medical}`, 80)
      .text(`Other: ₹${payrollData.allowances.other}`, 80);

    doc
      .text(`PF: ₹${payrollData.deductions.pf}`, 320, earningsY)
      .text(`ESI: ₹${payrollData.deductions.esi}`, 320)
      .text(`TDS: ₹${payrollData.deductions.tds}`, 320)
      .text(`Loan: ₹${payrollData.deductions.loan}`, 320)
      .text(`Other: ₹${payrollData.deductions.other}`, 320);

    doc.moveDown(2);

    // Summary
    doc
      .fontSize(12)
      .text(`Gross Salary: ₹${payrollData.gross_salary}`, 80)
      .text(`Total Deductions: ₹${payrollData.total_deductions}`, 320)
      .moveDown();

    doc
      .fontSize(14)
      .text(`Net Salary: ₹${payrollData.net_salary}`, { align: 'center' })
      .moveDown(3);

    // Footer
    doc
      .fontSize(10)
      .text('This is a computer-generated document.', { align: 'center' });

    const filename = `salary-slip-${payrollData.employee_id}-${payrollData.month}-${payrollData.year}.pdf`;
    return await this.savePdf(doc, filename);
  }

  // Generate attendance report
  async generateAttendanceReport(
    reportData: any,
    attendanceRecords: any[],
  ): Promise<string> {
    const doc = this.createDoc({
      title: 'Attendance Report',
      subject: 'Monthly Attendance Report',
    });

    // Header
    doc
      .fontSize(20)
      .text('GegoK12 School', { align: 'center' })
      .fontSize(14)
      .text('Attendance Report', { align: 'center' })
      .fontSize(12)
      .text(`${reportData.month} ${reportData.year}`, { align: 'center' })
      .moveDown(2);

    // Class Details
    doc
      .fontSize(12)
      .text(`Standard: ${reportData.standard}`)
      .text(`Section: ${reportData.section}`)
      .text(`Total Students: ${reportData.total_students}`)
      .moveDown(2);

    // Attendance Summary
    doc
      .fontSize(14)
      .text('Attendance Summary', { underline: true })
      .moveDown();

    const tableHeaders = ['Date', 'Present', 'Absent', 'Leave', 'Percentage'];
    const colWidths = [100, 80, 80, 80, 80];
    let currentX = 80;

    tableHeaders.forEach((header, i) => {
      doc.fontSize(10).text(header, currentX, doc.y, {
        width: colWidths[i],
        align: 'center',
      });
      currentX += colWidths[i];
    });

    doc.moveDown();

    attendanceRecords.forEach((record) => {
      const rowY = doc.y;
      currentX = 80;

      const rowData = [
        new Date(record.date).toLocaleDateString(),
        record.present.toString(),
        record.absent.toString(),
        record.leave.toString(),
        `${record.percentage}%`,
      ];

      rowData.forEach((data, i) => {
        doc.fontSize(9).text(data, currentX, rowY, {
          width: colWidths[i],
          align: 'center',
        });
        currentX += colWidths[i];
      });

      doc.moveDown();
    });

    const filename = `attendance-report-${reportData.standard}-${Date.now()}.pdf`;
    return await this.savePdf(doc, filename);
  }

  // Generate ID card
  async generateIdCard(userData: any): Promise<string> {
    const doc = this.createDoc({
      title: `ID Card - ${userData.name}`,
      subject: 'Identity Card',
    });

    // ID Card design (simplified)
    doc
      .rect(100, 100, 400, 250)
      .stroke();

    doc
      .fontSize(16)
      .text('GegoK12 School', 110, 120, { align: 'center', width: 380 })
      .fontSize(12)
      .text('Student Identity Card', 110, 145, { align: 'center', width: 380 })
      .moveDown(2);

    // Photo placeholder
    doc
      .rect(150, 180, 100, 120)
      .stroke()
      .fontSize(8)
      .text('PHOTO', 175, 235);

    // Details
    doc
      .fontSize(10)
      .text(`Name: ${userData.name}`, 270, 190)
      .text(`ID: ${userData.admission_no || userData.employee_id}`, 270, 210)
      .text(`Standard: ${userData.standard || 'N/A'}`, 270, 230)
      .text(`DOB: ${new Date(userData.dob).toLocaleDateString()}`, 270, 250)
      .text(`Blood Group: ${userData.blood_group || 'N/A'}`, 270, 270);

    const filename = `id-card-${userData.admission_no || userData.employee_id}-${Date.now()}.pdf`;
    return await this.savePdf(doc, filename);
  }
}
