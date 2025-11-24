import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TeacherAssignment, TeacherAssignmentDocument } from './schemas/teacher-assignment.schema';
import { CreateTeacherAssignmentDto } from './dto/create-teacher-assignment.dto';
import { UpdateTeacherAssignmentDto } from './dto/update-teacher-assignment.dto';

@Injectable()
export class TeacherAssignmentsService {
  constructor(
    @InjectModel(TeacherAssignment.name) private assignmentModel: Model<TeacherAssignmentDocument>,
  ) {}

  async create(createAssignmentDto: CreateTeacherAssignmentDto): Promise<TeacherAssignment> {
    // Check if assignment already exists
    const existingAssignment = await this.assignmentModel.findOne({
      school_id: new Types.ObjectId(createAssignmentDto.school_id),
      academic_year_id: new Types.ObjectId(createAssignmentDto.academic_year_id),
      teacher_id: new Types.ObjectId(createAssignmentDto.teacher_id),
      subject_id: new Types.ObjectId(createAssignmentDto.subject_id),
      standard: createAssignmentDto.standard,
      section_id: new Types.ObjectId(createAssignmentDto.section_id),
      deleted_at: null,
    });

    if (existingAssignment) {
      throw new ConflictException('Teacher assignment already exists for this combination');
    }

    // Check if trying to assign class teacher when one already exists
    if (createAssignmentDto.is_class_teacher) {
      const existingClassTeacher = await this.assignmentModel.findOne({
        school_id: new Types.ObjectId(createAssignmentDto.school_id),
        academic_year_id: new Types.ObjectId(createAssignmentDto.academic_year_id),
        standard: createAssignmentDto.standard,
        section_id: new Types.ObjectId(createAssignmentDto.section_id),
        is_class_teacher: true,
        status: 'active',
        deleted_at: null,
      });

      if (existingClassTeacher) {
        throw new ConflictException('This section already has a class teacher assigned');
      }
    }

    const assignment = new this.assignmentModel({
      ...createAssignmentDto,
      school_id: new Types.ObjectId(createAssignmentDto.school_id),
      academic_year_id: new Types.ObjectId(createAssignmentDto.academic_year_id),
      teacher_id: new Types.ObjectId(createAssignmentDto.teacher_id),
      subject_id: new Types.ObjectId(createAssignmentDto.subject_id),
      section_id: new Types.ObjectId(createAssignmentDto.section_id),
    });

    return assignment.save();
  }

  async findAll(
    schoolId: string,
    academicYearId?: string,
    teacherId?: string,
    subjectId?: string,
    standard?: number,
    sectionId?: string,
    status: string = 'active',
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: TeacherAssignment[]; total: number; page: number; totalPages: number }> {
    const query: any = {
      school_id: new Types.ObjectId(schoolId),
      status,
      deleted_at: null,
    };

    if (academicYearId && Types.ObjectId.isValid(academicYearId)) {
      query.academic_year_id = new Types.ObjectId(academicYearId);
    }

    if (teacherId && Types.ObjectId.isValid(teacherId)) {
      query.teacher_id = new Types.ObjectId(teacherId);
    }

    if (subjectId && Types.ObjectId.isValid(subjectId)) {
      query.subject_id = new Types.ObjectId(subjectId);
    }

    if (standard) {
      query.standard = standard;
    }

    if (sectionId && Types.ObjectId.isValid(sectionId)) {
      query.section_id = new Types.ObjectId(sectionId);
    }

    const total = await this.assignmentModel.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const data = await this.assignmentModel
      .find(query)
      .populate('teacher_id', 'user_id employee_id designation')
      .populate({
        path: 'teacher_id',
        populate: {
          path: 'user_id',
          select: 'first_name last_name email',
        },
      })
      .populate('subject_id', 'name code type')
      .populate('section_id', 'name capacity')
      .sort({ standard: 1, 'section_id.name': 1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      data,
      total,
      page,
      totalPages,
    };
  }

  async findById(id: string): Promise<TeacherAssignment> {
    const assignment = await this.assignmentModel
      .findOne({ _id: id, deleted_at: null })
      .populate('teacher_id', 'user_id employee_id designation')
      .populate({
        path: 'teacher_id',
        populate: {
          path: 'user_id',
          select: 'first_name last_name email',
        },
      })
      .populate('subject_id', 'name code type')
      .populate('section_id', 'name capacity')
      .exec();

    if (!assignment) {
      throw new NotFoundException(`Teacher assignment with ID ${id} not found`);
    }

    return assignment;
  }

  async getTeacherWorkload(teacherId: string, academicYearId: string): Promise<any> {
    const assignments = await this.assignmentModel
      .find({
        teacher_id: new Types.ObjectId(teacherId),
        academic_year_id: new Types.ObjectId(academicYearId),
        status: 'active',
        deleted_at: null,
      })
      .populate('subject_id', 'name code')
      .populate('section_id', 'name')
      .exec();

    const totalPeriods = assignments.reduce((sum, assignment) => sum + (assignment.periods_per_week || 0), 0);
    const subjectCount = new Set(assignments.map(a => a.subject_id.toString())).size;
    const classCount = new Set(assignments.map(a => `${a.standard}-${a.section_id}`)).size;

    return {
      assignments,
      summary: {
        total_periods_per_week: totalPeriods,
        total_subjects: subjectCount,
        total_classes: classCount,
        is_class_teacher: assignments.some(a => a.is_class_teacher),
      },
    };
  }

  async getClassTeacher(schoolId: string, academicYearId: string, standard: number, sectionId: string): Promise<TeacherAssignment | null> {
    return this.assignmentModel
      .findOne({
        school_id: new Types.ObjectId(schoolId),
        academic_year_id: new Types.ObjectId(academicYearId),
        standard,
        section_id: new Types.ObjectId(sectionId),
        is_class_teacher: true,
        status: 'active',
        deleted_at: null,
      })
      .populate('teacher_id', 'user_id employee_id')
      .populate({
        path: 'teacher_id',
        populate: {
          path: 'user_id',
          select: 'first_name last_name email',
        },
      })
      .exec();
  }

  async update(id: string, updateAssignmentDto: UpdateTeacherAssignmentDto): Promise<TeacherAssignment> {
    const updateData: any = { ...updateAssignmentDto };

    // Convert ObjectId fields
    ['school_id', 'academic_year_id', 'teacher_id', 'subject_id', 'section_id'].forEach(field => {
      if (updateAssignmentDto[field]) {
        updateData[field] = new Types.ObjectId(updateAssignmentDto[field]);
      }
    });

    // Check for conflicts if updating class teacher status
    if (updateAssignmentDto.is_class_teacher) {
      const currentAssignment = await this.findById(id);
      
      const existingClassTeacher = await this.assignmentModel.findOne({
        _id: { $ne: id },
        school_id: currentAssignment.school_id,
        academic_year_id: currentAssignment.academic_year_id,
        standard: updateAssignmentDto.standard || currentAssignment.standard,
        section_id: updateAssignmentDto.section_id ? new Types.ObjectId(updateAssignmentDto.section_id) : currentAssignment.section_id,
        is_class_teacher: true,
        status: 'active',
        deleted_at: null,
      });

      if (existingClassTeacher) {
        throw new ConflictException('This section already has a class teacher assigned');
      }
    }

    const assignment = await this.assignmentModel
      .findOneAndUpdate(
        { _id: id, deleted_at: null },
        updateData,
        { new: true, runValidators: true },
      )
      .populate('teacher_id', 'user_id employee_id designation')
      .populate({
        path: 'teacher_id',
        populate: {
          path: 'user_id',
          select: 'first_name last_name email',
        },
      })
      .populate('subject_id', 'name code type')
      .populate('section_id', 'name capacity')
      .exec();

    if (!assignment) {
      throw new NotFoundException(`Teacher assignment with ID ${id} not found`);
    }

    return assignment;
  }

  async remove(id: string): Promise<void> {
    const result = await this.assignmentModel
      .findOneAndUpdate(
        { _id: id, deleted_at: null },
        { deleted_at: new Date(), status: 'inactive' },
        { new: true },
      )
      .exec();

    if (!result) {
      throw new NotFoundException(`Teacher assignment with ID ${id} not found`);
    }
  }

  async getSubjectTeachers(schoolId: string, academicYearId: string, subjectId: string, standard?: number): Promise<TeacherAssignment[]> {
    const query: any = {
      school_id: new Types.ObjectId(schoolId),
      academic_year_id: new Types.ObjectId(academicYearId),
      subject_id: new Types.ObjectId(subjectId),
      status: 'active',
      deleted_at: null,
    };

    if (standard) {
      query.standard = standard;
    }

    return this.assignmentModel
      .find(query)
      .populate('teacher_id', 'user_id employee_id')
      .populate({
        path: 'teacher_id',
        populate: {
          path: 'user_id',
          select: 'first_name last_name email',
        },
      })
      .populate('section_id', 'name')
      .exec();
  }
}