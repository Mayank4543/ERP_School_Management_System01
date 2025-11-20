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
  ) { }

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    // Validate if user_id is a valid ObjectId
    if (!Types.ObjectId.isValid(createStudentDto.user_id)) {
      throw new Error(`Invalid user_id format: ${createStudentDto.user_id}`);
    }

    // Validate if school_id is a valid ObjectId
    if (!Types.ObjectId.isValid(createStudentDto.school_id)) {
      throw new Error(`Invalid school_id format: ${createStudentDto.school_id}`);
    }

    // Validate if academic_year_id is a valid ObjectId
    if (!Types.ObjectId.isValid(createStudentDto.academic_year_id)) {
      throw new Error(`Invalid academic_year_id format: ${createStudentDto.academic_year_id}`);
    }

    // Validate if section_id is a valid ObjectId
    if (!Types.ObjectId.isValid(createStudentDto.section_id)) {
      throw new Error(`Invalid section_id format: ${createStudentDto.section_id}`);
    }

    console.log('✅ All ObjectIds validated successfully');
    console.log('📄 Creating student with validated data:', createStudentDto);

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
    // Query with both ObjectId and String to handle legacy data
    const query: any = {
      $or: [
        { school_id: new Types.ObjectId(schoolId) },
        { school_id: schoolId }, // Handle if stored as string
      ],
      deleted_at: null,
    };

    if (academicYearId) {
      query.academic_year_id = new Types.ObjectId(academicYearId);
    }

    if (standard) {
      query.standard = standard;
    }

    console.log('🔍 MongoDB Query:', JSON.stringify(query, null, 2));
    console.log('📊 Query params: schoolId=', schoolId, 'page=', page, 'limit=', limit);

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.studentModel
        .find(query)
        .populate({
          path: 'user_id',
          select: 'name email mobile_no first_name last_name profile_picture',
          match: { deleted_at: null },
          populate: {
            path: 'profile',
            select: 'gender date_of_birth blood_group religion caste nationality mother_tongue address pincode',
            options: { strictPopulate: false }
          },
          options: { strictPopulate: false }
        })
        .populate({
          path: 'academic_year_id',
          select: 'name start_date end_date',
          options: { strictPopulate: false }
        })
        .sort({ standard: 1, roll_no: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.studentModel.countDocuments(query),
    ]);

    console.log(`✅ Found ${total} students, returning ${data.length} students`);
    if (data.length > 0) {
      const firstStudent = data[0] as any;
      console.log('🔍 Raw student data after population:');
      console.log('  - user_id type:', typeof firstStudent.user_id);
      console.log('  - user_id value:', firstStudent.user_id);
      console.log('  - user name:', firstStudent.user_id?.name);
      console.log('  - user email:', firstStudent.user_id?.email);
      console.log('  - user mobile:', firstStudent.user_id?.mobile_no);
      console.log('  - user profile:', firstStudent.user_id?.profile);
      console.log('  - section_id:', firstStudent.section_id);
      console.log('  - admission_no:', firstStudent.admission_no);
      
      // Check if user_id exists in users collection
      if (data[0].user_id && typeof data[0].user_id === 'string') {
        console.log('⚠️ user_id is a string, not populated. Checking if user exists...');
        try {
          const userExists = await this.studentModel.db.collection('users').findOne({ 
            _id: new Types.ObjectId(data[0].user_id) 
          });
          console.log('👤 User exists in DB:', !!userExists, userExists ? userExists.name : 'No user found');
        } catch (err) {
          console.log('❌ Error checking user:', err.message);
        }
      }
      
      // Check if section_id exists in sections collection
      if (data[0].section_id && typeof data[0].section_id === 'string') {
        console.log('⚠️ section_id is a string, not populated. Checking if section exists...');
        try {
          const sectionExists = await this.studentModel.db.collection('sections').findOne({ 
            _id: new Types.ObjectId(data[0].section_id) 
          });
          console.log('📚 Section exists in DB:', !!sectionExists, sectionExists ? sectionExists.name : 'No section found');
        } catch (err) {
          console.log('❌ Error checking section:', err.message);
        }
      }
    }

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
      .populate({
        path: 'user_id',
        select: 'name email mobile_no first_name last_name profile_picture',
        match: { deleted_at: null },
        populate: {
          path: 'profile',
          select: 'gender date_of_birth blood_group religion caste nationality mother_tongue address pincode',
          options: { strictPopulate: false }
        },
        options: { strictPopulate: false }
      })
      .populate({
        path: 'academic_year_id',
        select: 'name start_date end_date',
        options: { strictPopulate: false }
      })
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
    const query: any = {
      school_id: new Types.ObjectId(schoolId),
      standard,
      deleted_at: null,
    };

    // Only add academicYearId if it's a valid ObjectId
    if (academicYearId && Types.ObjectId.isValid(academicYearId)) {
      query.academic_year_id = new Types.ObjectId(academicYearId);
    }

    // Handle sectionId - it might be a simple string like "A" or an ObjectId
    if (Types.ObjectId.isValid(sectionId)) {
      query.section_id = new Types.ObjectId(sectionId);
    } else {
      // If not a valid ObjectId, treat it as a section name/code
      query.section = sectionId;
    }

    return this.studentModel
      .find(query)
      .sort({ roll_no: 1 })
      .exec();
  }
}
