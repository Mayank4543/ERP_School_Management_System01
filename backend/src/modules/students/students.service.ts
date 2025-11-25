import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Student, StudentDocument } from './schemas/student.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { UserProfile, UserProfileDocument } from '../users/schemas/user-profile.schema';
import { AcademicYear, AcademicYearDocument } from '../academic/schemas/academic-year.schema';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserProfile.name) private userProfileModel: Model<UserProfileDocument>,
    @InjectModel(AcademicYear.name) private academicYearModel: Model<AcademicYearDocument>,
  ) { }

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    // Convert string IDs to ObjectIds
    const studentData = {
      ...createStudentDto,
      user_id: new Types.ObjectId(createStudentDto.user_id),
      school_id: new Types.ObjectId(createStudentDto.school_id),
      academic_year_id: new Types.ObjectId(createStudentDto.academic_year_id),
      section_id: new Types.ObjectId(createStudentDto.section_id),
      ...(createStudentDto.route_id && {
        route_id: new Types.ObjectId(createStudentDto.route_id)
      }),
      ...(createStudentDto.parent_ids && {
        parent_ids: createStudentDto.parent_ids.map(id => new Types.ObjectId(id))
      }),
    };

    const createdStudent = new this.studentModel(studentData);
    return createdStudent.save();
  }

  async findAll(
    schoolId: string,
    academicYearId?: string,
    standard?: number,
    page: number = 1,
    limit: number = 20,
    status?: string,
  ): Promise<{
    data: Student[];
    total: number;
    page: number;
    totalPages: number;
  }> {
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

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      this.studentModel
        .find(query)
        .populate('user_id', 'first_name last_name email phone profile_picture')
        .populate({
          path: 'user_id',
          populate: {
            path: 'profile',
            model: 'UserProfile',
            select: 'gender date_of_birth blood_group nationality religion'
          }
        })
        .populate('academic_year_id', 'year_name start_date end_date')
        .populate('section_id', 'name')
        .populate({
          path: 'parent_ids',
          select: 'first_name last_name email phone profile_picture',
          populate: {
            path: 'profile',
            model: 'UserProfile',
            select: 'gender date_of_birth'
          }
        })
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.studentModel.countDocuments(query).exec(),
    ]);

    return {
      data: students,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Student> {
    const student = await this.studentModel
      .findOne({ _id: new Types.ObjectId(id), deleted_at: null })
      .populate('user_id', 'first_name last_name email phone profile_picture')
      .populate({
        path: 'user_id',
        populate: {
          path: 'profile',
          model: 'UserProfile',
          select: 'gender date_of_birth blood_group nationality religion'
        }
      })
      .populate('academic_year_id', 'year_name start_date end_date')
      .populate('section_id', 'name')
      .exec();

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  async findByAdmissionNo(admissionNo: string): Promise<Student> {
    const student = await this.studentModel
      .findOne({ admission_no: admissionNo, deleted_at: null })
      .populate('user_id', 'first_name last_name email phone profile_picture')
      .populate({
        path: 'user_id',
        populate: {
          path: 'profile',
          model: 'UserProfile',
          select: 'gender date_of_birth blood_group nationality religion'
        }
      })
      .populate('academic_year_id', 'year_name start_date end_date')
      .populate('section_id', 'name')
      .exec();

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  async findByUserId(userId: string): Promise<Student> {
    const student = await this.studentModel
      .findOne({ user_id: new Types.ObjectId(userId), deleted_at: null })
      .populate('user_id', 'first_name last_name email phone')
      .populate('academic_year_id', 'year_name start_date end_date')
      .exec();

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    // Convert string IDs to ObjectIds for update
    const updateData: any = { ...updateStudentDto };

    if (updateData.user_id) {
      updateData.user_id = new Types.ObjectId(updateData.user_id);
    }
    if (updateData.school_id) {
      updateData.school_id = new Types.ObjectId(updateData.school_id);
    }
    if (updateData.academic_year_id) {
      updateData.academic_year_id = new Types.ObjectId(updateData.academic_year_id);
    }
    if (updateData.section_id) {
      updateData.section_id = new Types.ObjectId(updateData.section_id);
    }
    if (updateData.route_id) {
      updateData.route_id = new Types.ObjectId(updateData.route_id);
    }
    if (updateData.parent_ids) {
      updateData.parent_ids = updateData.parent_ids.map((id: string) => new Types.ObjectId(id));
    }

    const updatedStudent = await this.studentModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id), deleted_at: null },
        { $set: { ...updateData, updated_at: new Date() } },
        { new: true },
      )
      .populate('user_id', 'first_name last_name email phone')
      .populate('academic_year_id', 'year_name start_date end_date')
      .exec();

    if (!updatedStudent) {
      throw new NotFoundException('Student not found');
    }

    return updatedStudent;
  }

  async remove(id: string): Promise<void> {
    const result = await this.studentModel
      .updateOne(
        { _id: new Types.ObjectId(id) },
        { $set: { deleted_at: new Date() } },
      )
      .exec();

    if (result.modifiedCount === 0) {
      throw new NotFoundException('Student not found');
    }
  }

  async getStudentsByClass(
    schoolId: string,
    academicYearId: string,
    standard: number,
    sectionId: string,
  ): Promise<Student[]> {
    const query: any = {
      school_id: new Types.ObjectId(schoolId),
      standard,
      section_id: new Types.ObjectId(sectionId),
      deleted_at: null,
    };

    if (academicYearId) {
      query.academic_year_id = new Types.ObjectId(academicYearId);
    }

    return this.studentModel
      .find(query)
      .populate('user_id', 'first_name last_name email phone profile_picture')
      .sort({ roll_no: 1 })
      .exec();
  }
}
