import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Homework, HomeworkDocument } from './schemas/homework.schema';
import { HomeworkSubmission, HomeworkSubmissionDocument } from './schemas/homework-submission.schema';
import { CreateHomeworkDto, MarkCompleteDto, UpdateHomeworkDto } from './dto/homework.dto';

@Injectable()
export class HomeworkService {
  constructor(
    @InjectModel(Homework.name) private homeworkModel: Model<HomeworkDocument>,
    @InjectModel(HomeworkSubmission.name) private submissionModel: Model<HomeworkSubmissionDocument>,
  ) {}

  async create(createDto: CreateHomeworkDto): Promise<Homework> {
    const homework = new this.homeworkModel({
      ...createDto,
      school_id: new Types.ObjectId(createDto.school_id),
      academic_year_id: new Types.ObjectId(createDto.academic_year_id),
      subject_id: new Types.ObjectId(createDto.subject_id),
      section_id: new Types.ObjectId(createDto.section_id),
      teacher_id: new Types.ObjectId(createDto.teacher_id),
      assigned_date: new Date(),
    });
    return homework.save();
  }

  async findAll(
    schoolId: string,
    academicYearId?: string,
    standard?: number,
    status?: string,
  ): Promise<Homework[]> {
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

    return this.homeworkModel
      .find(query)
      .sort({ due_date: 1, created_at: -1 })
      .exec();
  }

  async findById(id: string): Promise<Homework> {
    const homework = await this.homeworkModel
      .findOne({ _id: id, deleted_at: null })
      .exec();

    if (!homework) {
      throw new NotFoundException(`Homework with ID ${id} not found`);
    }

    return homework;
  }

  async findStudentHomework(studentId: string, status?: string): Promise<any[]> {
    // For production, get student's class and section first
    // For now, fetch all active homework and check submissions
    
    const query: any = { deleted_at: null, status: 'active' };
    
    const homeworkList = await this.homeworkModel
      .find(query)
      .sort({ due_date: 1 })
      .exec();

    // Get all submissions for this student
    const submissions = await this.submissionModel
      .find({ student_id: new Types.ObjectId(studentId), deleted_at: null })
      .exec();

    const submissionMap = new Map(
      submissions.map(s => [s.homework_id.toString(), s])
    );

    const now = new Date();
    
    return homeworkList.map(hw => {
      const submission = submissionMap.get(hw._id.toString());
      const isOverdue = now > new Date(hw.submission_date);
      const daysLeft = Math.ceil(
        (new Date(hw.submission_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      const isCompleted = submission?.status === 'submitted' || submission?.status === 'checked';

      return {
        _id: hw._id,
        subject: hw.subject,
        title: hw.title,
        description: hw.description,
        homework_date: hw.homework_date,
        submission_date: hw.submission_date,
        completed: isCompleted,
        completed_date: submission?.submitted_at,
        remarks: submission?.teacher_remarks,
        is_overdue: !isCompleted && isOverdue,
        days_left: daysLeft,
        status: isCompleted ? 'completed' : isOverdue ? 'overdue' : 'pending',
      };
    }).filter(hw => {
      if (status === 'pending') return !hw.completed && !hw.is_overdue;
      if (status === 'completed') return hw.completed;
      if (status === 'overdue') return hw.is_overdue;
      return true;
    });
  }

  async markComplete(
    homeworkId: string,
    studentId: string,
    markCompleteDto: MarkCompleteDto,
  ): Promise<HomeworkSubmission> {
    const homework = await this.homeworkModel.findById(homeworkId);
    if (!homework) {
      throw new NotFoundException('Homework not found');
    }

    // Check if submission already exists
    let submission = await this.submissionModel.findOne({
      homework_id: new Types.ObjectId(homeworkId),
      student_id: new Types.ObjectId(studentId),
      deleted_at: null,
    });

    if (submission) {
      // Update existing submission
      submission.status = markCompleteDto.completed ? 'submitted' : 'pending';
      submission.submitted_at = markCompleteDto.completed ? new Date() : null;
      submission.teacher_remarks = markCompleteDto.remarks;
      return submission.save();
    } else {
      // Create new submission
      submission = new this.submissionModel({
        homework_id: new Types.ObjectId(homeworkId),
        student_id: new Types.ObjectId(studentId),
        status: markCompleteDto.completed ? 'submitted' : 'pending',
        submitted_at: markCompleteDto.completed ? new Date() : null,
        teacher_remarks: markCompleteDto.remarks,
      });
      return submission.save();
    }
  }

  async update(id: string, updateDto: UpdateHomeworkDto): Promise<Homework> {
    const homework = await this.homeworkModel
      .findOneAndUpdate(
        { _id: id, deleted_at: null },
        { ...updateDto, updated_at: new Date() },
        { new: true },
      )
      .exec();

    if (!homework) {
      throw new NotFoundException(`Homework with ID ${id} not found`);
    }

    return homework;
  }

  async remove(id: string): Promise<void> {
    const result = await this.homeworkModel
      .findOneAndUpdate(
        { _id: id, deleted_at: null },
        { deleted_at: new Date() },
        { new: true },
      )
      .exec();

    if (!result) {
      throw new NotFoundException(`Homework with ID ${id} not found`);
    }
  }

  async getTodayHomework(
    schoolId: string,
    academicYearId: string,
    standard: number,
    sectionId: string,
  ): Promise<Homework[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.homeworkModel
      .find({
        school_id: new Types.ObjectId(schoolId),
        academic_year_id: new Types.ObjectId(academicYearId),
        standard,
        section_id: new Types.ObjectId(sectionId),
        assigned_date: { $gte: today, $lt: tomorrow },
        deleted_at: null,
      })
      .sort({ subject_name: 1 })
      .exec();
  }

  async getSubmissionStats(homeworkId: string): Promise<any> {
    const totalSubmissions = await this.submissionModel.countDocuments({
      homework_id: new Types.ObjectId(homeworkId),
      deleted_at: null,
    });

    const completedSubmissions = await this.submissionModel.countDocuments({
      homework_id: new Types.ObjectId(homeworkId),
      completed: true,
      deleted_at: null,
    });

    return {
      total: totalSubmissions,
      completed: completedSubmissions,
      pending: totalSubmissions - completedSubmissions,
      completion_rate: totalSubmissions > 0 
        ? Math.round((completedSubmissions / totalSubmissions) * 100) 
        : 0,
    };
  }
}
