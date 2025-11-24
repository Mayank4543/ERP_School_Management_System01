import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Teacher, TeacherDocument } from './schemas/teacher.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { UserProfile, UserProfileDocument } from '../users/schemas/user-profile.schema';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserProfile.name) private userProfileModel: Model<UserProfileDocument>,
  ) { }

  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    const teacher = new this.teacherModel(createTeacherDto);
    return teacher.save();
  }

  async findAll(
    schoolId: string,
    department?: string,
    designation?: string,
    status?: string,
    search?: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: Teacher[]; total: number; page: number; totalPages: number }> {
    console.log('TeachersService.findAll called with:', {
      schoolId,
      department,
      designation,
      status,
      search,
      page,
      limit
    });

    if (!schoolId) {
      console.error('No schoolId provided to TeachersService.findAll');
      return { data: [], total: 0, page: 1, totalPages: 0 };
    }

    const query: any = {
      school_id: new Types.ObjectId(schoolId),
      deleted_at: null,
    };

    if (department) query.department = department;
    if (designation) query.designation = designation;
    if (status) query.status = status;

    // Handle search functionality - enhanced to search through user data as well
    if (search) {
      query.$or = [
        { employee_id: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { subjects: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const skip = (page - 1) * limit;

    console.log('Query being used:', JSON.stringify(query, null, 2));

    // Test with just school_id to debug
    const debugQuery = { school_id: new Types.ObjectId(schoolId) };
    const debugTeachers = await this.teacherModel.find(debugQuery).exec();
    console.log('Debug query with ObjectId school_id only:', debugTeachers.length, 'teachers found');

    // Test without any query to see total teachers
    const allTeachers = await this.teacherModel.find({}).exec();
    console.log('Total teachers in database:', allTeachers.length);
    if (allTeachers.length > 0) {
      console.log('Sample teacher from DB:', JSON.stringify(allTeachers[0], null, 2));
    }

    let aggregationPipeline: any[] = [
      { $match: query },
      {
        $addFields: {
          user_id_obj: {
            $cond: {
              if: { $type: "$user_id" },
              then: { $toObjectId: "$user_id" },
              else: "$user_id"
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id_obj',
          foreignField: '_id',
          as: 'user_data',
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
          path: '$user_data',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          user_id: '$user_data'
        }
      },
      {
        $unset: ['user_data', 'user_id_obj']
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

    console.log('Aggregation pipeline:', JSON.stringify(aggregationPipeline, null, 2));
    console.log('Count pipeline:', JSON.stringify(countPipeline, null, 2));

    // First, let's try a simple query without aggregation to see if teachers exist
    const simpleTeachers = await this.teacherModel.find(query).exec();
    console.log('Simple query result:', simpleTeachers.length, 'teachers found');
    console.log('Sample simple teacher:', simpleTeachers[0]);

    // If simple query failed, let's try with string school_id
    if (simpleTeachers.length === 0) {
      console.log('Trying query with string school_id...');
      const stringQuery: any = {
        school_id: schoolId, // Use string instead of ObjectId
        deleted_at: null,
      };
      if (department) stringQuery.department = department;
      if (status) stringQuery.status = status;

      const stringTeachers = await this.teacherModel.find(stringQuery).exec();
      console.log('String school_id query result:', stringTeachers.length, 'teachers found');

      if (stringTeachers.length > 0) {
        console.log('SUCCESS: Teachers found with string school_id! Using string query.');
        // Update the main query to use string school_id
        query.school_id = schoolId;

        // Update aggregation pipeline to use string comparison
        aggregationPipeline[0] = { $match: query };
      }
    }

    const [data, totalResult] = await Promise.all([
      this.teacherModel.aggregate(aggregationPipeline).exec(),
      this.teacherModel.aggregate(countPipeline).exec(),
    ]);

    const total = totalResult.length > 0 ? totalResult[0].count : 0;

    console.log('TeachersService.findAll result:', {
      dataCount: data.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      sampleData: data.slice(0, 2) // Show first 2 records for debugging
    });

    // If aggregation returns no results but simple query found teachers, use simple approach
    if (data.length === 0 && simpleTeachers.length > 0) {
      console.log('Aggregation failed, falling back to simple query + populate');

      const fallbackTeachers = await this.teacherModel
        .find(query)
        .populate({
          path: 'user_id',
          model: 'User',
          populate: {
            path: 'profile',
            model: 'UserProfile'
          }
        })
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .exec();

      const fallbackTotal = await this.teacherModel.countDocuments(query).exec();

      console.log('Fallback result:', {
        dataCount: fallbackTeachers.length,
        total: fallbackTotal,
        sampleData: fallbackTeachers.slice(0, 1)
      });

      return {
        data: fallbackTeachers,
        total: fallbackTotal,
        page,
        totalPages: Math.ceil(fallbackTotal / limit),
      };
    }

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Teacher> {
    console.log('TeachersService.findById called with id:', id);

    try {
      // First try the aggregation approach
      const teachers = await this.teacherModel.aggregate([
        { $match: { _id: new Types.ObjectId(id), deleted_at: null } },
        {
          $addFields: {
            user_id_obj: {
              $cond: {
                if: { $type: "$user_id" },
                then: { $toObjectId: "$user_id" },
                else: "$user_id"
              }
            }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id_obj',
            foreignField: '_id',
            as: 'user_data',
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
            path: '$user_data',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $addFields: {
            user_id: '$user_data'
          }
        },
        {
          $unset: ['user_data', 'user_id_obj']
        }
      ]).exec();

      console.log('Aggregation result:', teachers.length, 'teachers found');

      if (teachers && teachers.length > 0) {
        console.log('Teacher found via aggregation:', teachers[0]);
        return teachers[0];
      }

      // Fallback to populate method
      console.log('Aggregation failed, trying populate method');
      const teacher = await this.teacherModel
        .findOne({ _id: new Types.ObjectId(id), deleted_at: null })
        .populate({
          path: 'user_id',
          model: 'User',
          populate: {
            path: 'profile',
            model: 'UserProfile'
          }
        })
        .exec();

      if (teacher) {
        console.log('Teacher found via populate:', teacher);
        return teacher;
      }

      throw new NotFoundException(`Teacher with ID ${id} not found`);
    } catch (error) {
      console.error('Error in findById:', error);
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
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
