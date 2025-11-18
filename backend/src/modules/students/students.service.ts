import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Student, StudentDocument } from './schemas/student.schema';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const student = new this.studentModel(createStudentDto);
    return student.save();
  }

  async findAll(
    schoolId: string,
    academicYearId?: string,
    standard?: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: Student[]; total: number; page: number; totalPages: number }> {
    const query: any = {
      school_id: new Types.ObjectId(schoolId),
      deleted_at: null,
    };

    if (academicYearId) {
      query.academic_year_id = new Types.ObjectId(academicYearId);
    }

    if (standard) {
      query.standard = standard;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.studentModel
        .find(query)
        .sort({ standard: 1, roll_no: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.studentModel.countDocuments(query),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Student> {
    const student = await this.studentModel
      .findOne({ _id: id, deleted_at: null })
      .exec();

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
  }

  async findByAdmissionNo(admissionNo: string): Promise<Student> {
    const student = await this.studentModel
      .findOne({ admission_no: admissionNo, deleted_at: null })
      .exec();

    if (!student) {
      throw new NotFoundException(`Student with admission number ${admissionNo} not found`);
    }

    return student;
  }

  async findByUserId(userId: string): Promise<Student> {
    const student = await this.studentModel
      .findOne({ user_id: new Types.ObjectId(userId), deleted_at: null })
      .exec();

    if (!student) {
      throw new NotFoundException(`Student with user ID ${userId} not found`);
    }

    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const student = await this.studentModel
      .findOneAndUpdate(
        { _id: id, deleted_at: null },
        { ...updateStudentDto, updated_at: new Date() },
        { new: true },
      )
      .exec();

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
  }

  async remove(id: string): Promise<void> {
    const result = await this.studentModel
      .findOneAndUpdate(
        { _id: id, deleted_at: null },
        { deleted_at: new Date() },
        { new: true },
      )
      .exec();

    if (!result) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
  }

  async getStudentsByClass(
    schoolId: string,
    academicYearId: string,
    standard: number,
    sectionId: string,
  ): Promise<Student[]> {
    return this.studentModel
      .find({
        school_id: new Types.ObjectId(schoolId),
        academic_year_id: new Types.ObjectId(academicYearId),
        standard,
        section_id: new Types.ObjectId(sectionId),
        deleted_at: null,
      })
      .sort({ roll_no: 1 })
      .exec();
  }
}
