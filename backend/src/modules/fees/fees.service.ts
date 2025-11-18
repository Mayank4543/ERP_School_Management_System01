import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FeeStructure, FeeStructureDocument } from './schemas/fee-structure.schema';
import { StudentFee, StudentFeeDocument } from './schemas/student-fee.schema';
import { FeePayment, FeePaymentDocument } from './schemas/fee-payment.schema';
import { CreateFeeStructureDto } from './dto/create-fee-structure.dto';
import { UpdateFeeStructureDto } from './dto/update-fee-structure.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class FeesService {
  constructor(
    @InjectModel(FeeStructure.name) private feeStructureModel: Model<FeeStructureDocument>,
    @InjectModel(StudentFee.name) private studentFeeModel: Model<StudentFeeDocument>,
    @InjectModel(FeePayment.name) private feePaymentModel: Model<FeePaymentDocument>,
  ) {}

  // Fee Structure Methods
  async createFeeStructure(createDto: CreateFeeStructureDto): Promise<FeeStructure> {
    const feeStructure = new this.feeStructureModel({
      ...createDto,
      school_id: new Types.ObjectId(createDto.school_id),
      academic_year_id: new Types.ObjectId(createDto.academic_year_id),
    });
    return feeStructure.save();
  }

  async findAllFeeStructures(schoolId: string, academicYearId?: string, standard?: number): Promise<FeeStructure[]> {
    const query: any = {
      school_id: new Types.ObjectId(schoolId),
      deleted_at: null,
    };
    if (academicYearId) query.academic_year_id = new Types.ObjectId(academicYearId);
    if (standard) query.standard = standard;

    return this.feeStructureModel.find(query).exec();
  }

  // Student Fee Methods
  async getStudentFees(studentId: string): Promise<StudentFee> {
    const studentFee = await this.studentFeeModel
      .findOne({ student_id: new Types.ObjectId(studentId), deleted_at: null })
      .exec();

    if (!studentFee) {
      // Return default structure if not found
      return {
        student_id: new Types.ObjectId(studentId),
        total_fees: 0,
        paid_fees: 0,
        pending_fees: 0,
        fee_items: [],
      } as any;
    }

    return studentFee;
  }

  async getStudentPaymentHistory(studentId: string): Promise<FeePayment[]> {
    return this.feePaymentModel
      .find({ student_id: new Types.ObjectId(studentId), deleted_at: null })
      .sort({ payment_date: -1 })
      .exec();
  }

  // Payment Methods
  async recordPayment(createPaymentDto: CreatePaymentDto, createdBy: string): Promise<FeePayment> {
    const receiptNo = `FEE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const payment = new this.feePaymentModel({
      ...createPaymentDto,
      student_id: new Types.ObjectId(createPaymentDto.student_id),
      school_id: new Types.ObjectId('000000000000000000000000'), // Will be set from user context
      academic_year_id: new Types.ObjectId('000000000000000000000000'), // Will be set from current year
      receipt_no: receiptNo,
      payment_date: new Date(),
      created_by: new Types.ObjectId(createdBy),
    });

    const savedPayment = await payment.save();

    // Update student fee record
    await this.updateStudentFeeAfterPayment(createPaymentDto.student_id, createPaymentDto.amount, createPaymentDto.fee_type);

    return savedPayment;
  }

  private async updateStudentFeeAfterPayment(studentId: string, amount: number, feeType: string): Promise<void> {
    const studentFee = await this.studentFeeModel.findOne({
      student_id: new Types.ObjectId(studentId),
      deleted_at: null,
    });

    if (studentFee) {
      studentFee.paid_fees += amount;
      studentFee.pending_fees = Math.max(0, studentFee.total_fees - studentFee.paid_fees);

      // Update fee item status
      const feeItem = studentFee.fee_items.find(item => item.fee_type === feeType);
      if (feeItem && feeItem.status === 'pending') {
        feeItem.status = 'paid';
      }

      await studentFee.save();
    }
  }

  async getDefaulters(schoolId: string): Promise<StudentFee[]> {
    return this.studentFeeModel
      .find({
        school_id: new Types.ObjectId(schoolId),
        pending_fees: { $gt: 0 },
        deleted_at: null,
      })
      .sort({ pending_fees: -1 })
      .exec();
  }

  async getPaymentReceipt(receiptNo: string): Promise<FeePayment> {
    const payment = await this.feePaymentModel
      .findOne({ receipt_no: receiptNo, deleted_at: null })
      .exec();

    if (!payment) {
      throw new NotFoundException(`Payment receipt ${receiptNo} not found`);
    }

    return payment;
  }
}
