import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Exam, ExamDocument } from './schemas/exam.schema';
import { Mark, MarkDocument } from './schemas/mark.schema';

@Injectable()
export class ExamsService {
  constructor(
    @InjectModel(Exam.name) private examModel: Model<ExamDocument>,
    @InjectModel(Mark.name) private markModel: Model<MarkDocument>,
  ) {}

  async createExam(createExamDto: any): Promise<Exam> {
    const exam = new this.examModel(createExamDto);
    return exam.save();
  }

  async findAllExams(schoolId: string, academicYearId?: string): Promise<Exam[]> {
    const query: any = { school_id: new Types.ObjectId(schoolId), deleted_at: null };
    if (academicYearId) query.academic_year_id = new Types.ObjectId(academicYearId);

    return this.examModel.find(query).sort({ start_date: -1 }).exec();
  }

  async findExamById(id: string): Promise<Exam> {
    const exam = await this.examModel.findOne({ _id: id, deleted_at: null }).exec();
    if (!exam) throw new NotFoundException(`Exam with ID ${id} not found`);
    return exam;
  }

  async enterMarks(markDto: any): Promise<Mark> {
    const percentage = (markDto.marks_obtained / markDto.total_marks) * 100;
    const grade = this.calculateGrade(percentage);

    const mark = new this.markModel({
      ...markDto,
      percentage,
      grade,
    });

    return mark.save();
  }

  async getStudentMarks(studentId: string, examId: string): Promise<Mark[]> {
    return this.markModel
      .find({
        student_id: new Types.ObjectId(studentId),
        exam_id: new Types.ObjectId(examId),
        deleted_at: null,
      })
      .exec();
  }

  async getExamResults(examId: string): Promise<any[]> {
    return this.markModel.aggregate([
      { $match: { exam_id: new Types.ObjectId(examId), deleted_at: null } },
      {
        $group: {
          _id: '$student_id',
          total_marks: { $sum: '$marks_obtained' },
          max_marks: { $sum: '$total_marks' },
          subjects: { $push: { subject: '$subject', marks: '$marks_obtained', grade: '$grade' } },
        },
      },
      {
        $addFields: {
          percentage: { $multiply: [{ $divide: ['$total_marks', '$max_marks'] }, 100] },
        },
      },
      { $sort: { percentage: -1 } },
    ]);
  }

  private calculateGrade(percentage: number): string {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  }
}
