import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Teacher, TeacherDocument } from './schemas/teacher.schema';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
  ) {}

  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    const teacher = new this.teacherModel(createTeacherDto);
    return teacher.save();
  }

  async findAll(
    schoolId: string,
    department?: string,
    status?: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: Teacher[]; total: number; page: number; totalPages: number }> {
    const query: any = {
      school_id: new Types.ObjectId(schoolId),
      deleted_at: null,
    };

    if (department) query.department = department;
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.teacherModel
        .find(query)
        .populate('user_id', 'name email mobile_no')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.teacherModel.countDocuments(query),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Teacher> {
    const teacher = await this.teacherModel
      .findOne({ _id: id, deleted_at: null })
      .populate('user_id', 'name email mobile_no')
      .exec();

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    return teacher;
  }

  async findByEmployeeId(employeeId: string): Promise<Teacher> {
    const teacher = await this.teacherModel
      .findOne({ employee_id: employeeId, deleted_at: null })
      .populate('user_id')
      .exec();

    if (!teacher) {
      throw new NotFoundException(`Teacher with employee ID ${employeeId} not found`);
    }

    return teacher;
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto): Promise<Teacher> {
    const teacher = await this.teacherModel
      .findOneAndUpdate(
        { _id: id, deleted_at: null },
        { ...updateTeacherDto, updated_at: new Date() },
        { new: true },
      )
      .exec();

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    return teacher;
  }

  async remove(id: string): Promise<void> {
    const result = await this.teacherModel
      .findOneAndUpdate(
        { _id: id, deleted_at: null },
        { deleted_at: new Date() },
        { new: true },
      )
      .exec();

    if (!result) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
  }

  async getTeachersBySubject(schoolId: string, subject: string): Promise<Teacher[]> {
    return this.teacherModel
      .find({
        school_id: new Types.ObjectId(schoolId),
        subjects: subject,
        status: 'active',
        deleted_at: null,
      })
      .populate('user_id', 'name email')
      .exec();
  }
}
