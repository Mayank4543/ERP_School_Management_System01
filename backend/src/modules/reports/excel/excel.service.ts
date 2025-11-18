import { Injectable, Logger } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ExcelService {
  private readonly logger = new Logger(ExcelService.name);
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'excel');

  constructor() {
    // Create upload directory if it doesn't exist
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  // Export students data to Excel
  async exportStudents(students: any[]): Promise<string> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Students');

    // Define columns
    worksheet.columns = [
      { header: 'Admission No', key: 'admission_no', width: 15 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Father Name', key: 'father_name', width: 25 },
      { header: 'Mother Name', key: 'mother_name', width: 25 },
      { header: 'Date of Birth', key: 'dob', width: 15 },
      { header: 'Gender', key: 'gender', width: 10 },
      { header: 'Blood Group', key: 'blood_group', width: 12 },
      { header: 'Standard', key: 'standard', width: 10 },
      { header: 'Section', key: 'section', width: 10 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Address', key: 'address', width: 40 },
      { header: 'Status', key: 'status', width: 12 },
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' },
    };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Add data rows
    students.forEach((student) => {
      worksheet.addRow({
        admission_no: student.admission_no,
        name: student.name,
        father_name: student.father_name,
        mother_name: student.mother_name,
        dob: student.dob ? new Date(student.dob).toLocaleDateString() : '',
        gender: student.gender,
        blood_group: student.blood_group,
        standard: student.standard,
        section: student.section,
        email: student.email,
        phone: student.phone,
        address: student.address,
        status: student.status,
      });
    });

    // Auto-filter
    worksheet.autoFilter = {
      from: 'A1',
      to: 'M1',
    };

    const filename = `students-export-${Date.now()}.xlsx`;
    const filepath = path.join(this.uploadDir, filename);
    await workbook.xlsx.writeFile(filepath);

    this.logger.log(`Students exported to: ${filepath}`);
    return filepath;
  }

  // Import students from Excel
  async importStudents(filepath: string): Promise<any[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filepath);

    const worksheet = workbook.getWorksheet('Students');
    const students: any[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        students.push({
          admission_no: row.getCell(1).value,
          name: row.getCell(2).value,
          father_name: row.getCell(3).value,
          mother_name: row.getCell(4).value,
          dob: row.getCell(5).value,
          gender: row.getCell(6).value,
          blood_group: row.getCell(7).value,
          standard: row.getCell(8).value,
          section: row.getCell(9).value,
          email: row.getCell(10).value,
          phone: row.getCell(11).value,
          address: row.getCell(12).value,
          status: row.getCell(13).value || 'active',
        });
      }
    });

    this.logger.log(`Imported ${students.length} students from Excel`);
    return students;
  }

  // Export attendance report
  async exportAttendanceReport(
    reportData: any,
    records: any[],
  ): Promise<string> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attendance Report');

    // Add report header
    worksheet.mergeCells('A1:F1');
    worksheet.getCell('A1').value = `Attendance Report - ${reportData.month} ${reportData.year}`;
    worksheet.getCell('A1').font = { size: 14, bold: true };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    worksheet.addRow([]);
    worksheet.addRow(['Standard:', reportData.standard, 'Section:', reportData.section]);
    worksheet.addRow([]);

    // Define columns
    worksheet.addRow(['Date', 'Present', 'Absent', 'Leave', 'Total', 'Percentage']);
    
    // Style header
    const headerRow = worksheet.getRow(5);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' },
    };

    // Add data
    records.forEach((record) => {
      worksheet.addRow([
        new Date(record.date).toLocaleDateString(),
        record.present,
        record.absent,
        record.leave,
        record.total,
        `${record.percentage}%`,
      ]);
    });

    // Auto-fit columns
    worksheet.columns.forEach((column) => {
      column.width = 15;
    });

    const filename = `attendance-report-${Date.now()}.xlsx`;
    const filepath = path.join(this.uploadDir, filename);
    await workbook.xlsx.writeFile(filepath);

    this.logger.log(`Attendance report exported to: ${filepath}`);
    return filepath;
  }

  // Export exam results
  async exportExamResults(examData: any, results: any[]): Promise<string> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Exam Results');

    // Header
    worksheet.mergeCells('A1:H1');
    worksheet.getCell('A1').value = `Exam Results - ${examData.exam_name}`;
    worksheet.getCell('A1').font = { size: 14, bold: true };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    worksheet.addRow([]);
    worksheet.addRow(['Standard:', examData.standard, 'Date:', new Date(examData.exam_date).toLocaleDateString()]);
    worksheet.addRow([]);

    // Columns
    worksheet.addRow([
      'Roll No',
      'Name',
      'Subject',
      'Max Marks',
      'Obtained Marks',
      'Grade',
      'Percentage',
      'Remarks',
    ]);

    const headerRow = worksheet.getRow(5);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' },
    };

    // Data
    results.forEach((result) => {
      worksheet.addRow([
        result.roll_no,
        result.student_name,
        result.subject,
        result.max_marks,
        result.obtained_marks,
        result.grade,
        `${((result.obtained_marks / result.max_marks) * 100).toFixed(2)}%`,
        result.remarks || '',
      ]);
    });

    worksheet.columns.forEach((column) => {
      column.width = 15;
    });

    const filename = `exam-results-${examData.exam_name.replace(/\s+/g, '-')}-${Date.now()}.xlsx`;
    const filepath = path.join(this.uploadDir, filename);
    await workbook.xlsx.writeFile(filepath);

    this.logger.log(`Exam results exported to: ${filepath}`);
    return filepath;
  }

  // Export fee collection report
  async exportFeeCollectionReport(
    reportData: any,
    payments: any[],
  ): Promise<string> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Fee Collection');

    // Header
    worksheet.mergeCells('A1:G1');
    worksheet.getCell('A1').value = 'Fee Collection Report';
    worksheet.getCell('A1').font = { size: 14, bold: true };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    worksheet.addRow([]);
    worksheet.addRow(['Period:', reportData.period]);
    worksheet.addRow([]);

    // Columns
    worksheet.addRow([
      'Receipt No',
      'Date',
      'Student Name',
      'Admission No',
      'Fee Type',
      'Amount',
      'Payment Mode',
    ]);

    const headerRow = worksheet.getRow(5);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' },
    };

    // Data
    let totalAmount = 0;
    payments.forEach((payment) => {
      worksheet.addRow([
        payment.receipt_no,
        new Date(payment.payment_date).toLocaleDateString(),
        payment.student_name,
        payment.admission_no,
        payment.fee_type,
        payment.amount,
        payment.payment_mode,
      ]);
      totalAmount += payment.amount;
    });

    // Add total row
    worksheet.addRow([]);
    const totalRow = worksheet.addRow(['', '', '', '', 'TOTAL:', totalAmount, '']);
    totalRow.font = { bold: true };
    totalRow.getCell(6).numFmt = '₹#,##0.00';

    // Format amount column
    worksheet.getColumn(6).numFmt = '₹#,##0.00';
    worksheet.columns.forEach((column) => {
      column.width = 15;
    });

    const filename = `fee-collection-${Date.now()}.xlsx`;
    const filepath = path.join(this.uploadDir, filename);
    await workbook.xlsx.writeFile(filepath);

    this.logger.log(`Fee collection report exported to: ${filepath}`);
    return filepath;
  }

  // Export payroll report
  async exportPayrollReport(payrollRecords: any[]): Promise<string> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Payroll');

    // Header
    worksheet.mergeCells('A1:L1');
    worksheet.getCell('A1').value = 'Payroll Report';
    worksheet.getCell('A1').font = { size: 14, bold: true };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    worksheet.addRow([]);
    worksheet.addRow([]);

    // Columns
    worksheet.addRow([
      'Employee ID',
      'Name',
      'Month',
      'Year',
      'Basic Salary',
      'Allowances',
      'Deductions',
      'Gross Salary',
      'Net Salary',
      'Payment Date',
      'Payment Mode',
      'Status',
    ]);

    const headerRow = worksheet.getRow(4);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' },
    };

    // Data
    payrollRecords.forEach((record) => {
      worksheet.addRow([
        record.employee_id,
        record.employee_name,
        record.month,
        record.year,
        record.basic_salary,
        record.total_allowances,
        record.total_deductions,
        record.gross_salary,
        record.net_salary,
        record.payment_date ? new Date(record.payment_date).toLocaleDateString() : '',
        record.payment_mode || '',
        record.status,
      ]);
    });

    // Format currency columns
    [5, 6, 7, 8, 9].forEach((col) => {
      worksheet.getColumn(col).numFmt = '₹#,##0.00';
    });

    worksheet.columns.forEach((column) => {
      column.width = 15;
    });

    const filename = `payroll-report-${Date.now()}.xlsx`;
    const filepath = path.join(this.uploadDir, filename);
    await workbook.xlsx.writeFile(filepath);

    this.logger.log(`Payroll report exported to: ${filepath}`);
    return filepath;
  }

  // Generate bulk import template
  async generateStudentImportTemplate(): Promise<string> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Students Template');

    // Add instructions
    worksheet.mergeCells('A1:M1');
    worksheet.getCell('A1').value = 'Student Import Template - Fill in the required details below';
    worksheet.getCell('A1').font = { size: 12, bold: true, color: { argb: 'FFFF0000' } };
    
    worksheet.addRow([]);

    // Define columns with sample data
    worksheet.columns = [
      { header: 'Admission No*', key: 'admission_no', width: 15 },
      { header: 'Name*', key: 'name', width: 25 },
      { header: 'Father Name*', key: 'father_name', width: 25 },
      { header: 'Mother Name*', key: 'mother_name', width: 25 },
      { header: 'Date of Birth (DD/MM/YYYY)*', key: 'dob', width: 20 },
      { header: 'Gender (Male/Female)*', key: 'gender', width: 15 },
      { header: 'Blood Group', key: 'blood_group', width: 12 },
      { header: 'Standard*', key: 'standard', width: 10 },
      { header: 'Section', key: 'section', width: 10 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone*', key: 'phone', width: 15 },
      { header: 'Address*', key: 'address', width: 40 },
      { header: 'Status (active/inactive)', key: 'status', width: 15 },
    ];

    // Style header
    const headerRow = worksheet.getRow(3);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' },
    };

    // Add sample row
    worksheet.addRow({
      admission_no: 'ADM001',
      name: 'John Doe',
      father_name: 'Robert Doe',
      mother_name: 'Jane Doe',
      dob: '15/08/2010',
      gender: 'Male',
      blood_group: 'B+',
      standard: '10',
      section: 'A',
      email: 'john@example.com',
      phone: '9876543210',
      address: '123 Main Street, City',
      status: 'active',
    });

    const filename = `student-import-template.xlsx`;
    const filepath = path.join(this.uploadDir, filename);
    await workbook.xlsx.writeFile(filepath);

    this.logger.log(`Import template generated: ${filepath}`);
    return filepath;
  }
}
