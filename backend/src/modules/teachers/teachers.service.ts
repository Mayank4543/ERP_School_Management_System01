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
    search?: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: Teacher[]; total: number; page: number; totalPages: number }> {
    const query: any = {
      school_id: new Types.ObjectId(schoolId),
      deleted_at: null,
    };

    if (department) query.department = department;
    if (status) query.status = status;

    // Handle search functionality
    if (search) {
      query.$or = [
        { employee_id: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { subjects: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const skip = (page - 1) * limit;

    let aggregationPipeline: any[] = [
      { $match: query },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user_id',
          pipeline: [
            {
              $lookup: {
                from: 'userprofiles',
                localField: '_id',
                foreignField: 'user_id',
                as: 'profile'
              }
            },
            {
              $unwind: {
                path: '$profile',
                preserveNullAndEmptyArrays: true
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: '$user_id',
          preserveNullAndEmptyArrays: true
        }
      }
    ];

    // If search is provided, add additional search conditions for user data
    if (search) {
      aggregationPipeline.push({
        $match: {
          $or: [
            { employee_id: { $regex: search, $options: 'i' } },
            { designation: { $regex: search, $options: 'i' } },
            { department: { $regex: search, $options: 'i' } },
            { subjects: { $in: [new RegExp(search, 'i')] } },
            { 'user_id.name': { $regex: search, $options: 'i' } },
            { 'user_id.email': { $regex: search, $options: 'i' } },
            { 'user_id.mobile_no': { $regex: search, $options: 'i' } },
          ]
        }
      });
    }

    // Add sorting, skip and limit
    aggregationPipeline.push(
      { $sort: { created_at: -1 } },
      { $skip: skip },
      { $limit: limit }
    );

    // Create a separate pipeline for counting
    const countPipeline = [...aggregationPipeline];
    // Remove sort, skip, limit for count
    const sortIndex = countPipeline.findIndex(stage => stage.$sort);
    if (sortIndex !== -1) {
      countPipeline.splice(sortIndex);
    }
    countPipeline.push({ $count: 'count' });

    const [data, totalResult] = await Promise.all([
      this.teacherModel.aggregate(aggregationPipeline).exec(),
      this.teacherModel.aggregate(countPipeline).exec(),
    ]);

    const total = totalResult.length > 0 ? totalResult[0].count : 0;

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Teacher> {
    const teachers = await this.teacherModel.aggregate([
      { $match: { _id: new Types.ObjectId(id), deleted_at: null } },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user_id',
          pipeline: [
            {
              $lookup: {
                from: 'userprofiles',
                localField: '_id',
                foreignField: 'user_id',
                as: 'profile'
              }
            },
            {
              $unwind: {
                path: '$profile',
                preserveNullAndEmptyArrays: true
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: '$user_id',
          preserveNullAndEmptyArrays: true
        }
      }
    ]).exec();

    if (!teachers || teachers.length === 0) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    return teachers[0];
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
