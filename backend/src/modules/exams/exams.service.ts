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
  ) { }

  async createExam(createExamDto: any): Promise<Exam> {
    console.log('Creating exam with data:', createExamDto);

    // Ensure proper ObjectId conversion
    const examData = {
      ...createExamDto,
      school_id: new Types.ObjectId(createExamDto.school_id),
      academic_year_id: new Types.ObjectId(createExamDto.academic_year_id),
    };

    console.log('Processed exam data:', examData);
    const exam = new this.examModel(examData);
    const savedExam = await exam.save();
    console.log('Saved exam:', savedExam);
    return savedExam;
  }

  async findAllExams(
    schoolId: string,
    academicYearId?: string,
    page = 1,
    limit = 20
  ): Promise<{ exams: Exam[]; total: number }> {
    console.log('Finding exams for school:', schoolId, 'academic year:', academicYearId);

    // Handle both string and ObjectId formats for existing data
    const query: any = {
      $or: [
        { school_id: schoolId }, // For existing string data
        { school_id: new Types.ObjectId(schoolId) } // For proper ObjectId data
      ],
      deleted_at: null
    };

    if (academicYearId) {
      query.$and = [
        {
          $or: [
            { academic_year_id: academicYearId },
            { academic_year_id: new Types.ObjectId(academicYearId) }
          ]
        }
      ];
    }

    console.log('Exam query:', JSON.stringify(query, null, 2));

    const skip = (page - 1) * limit;
    const [exams, total] = await Promise.all([
      this.examModel.find(query).sort({ start_date: -1 }).skip(skip).limit(limit).exec(),
      this.examModel.countDocuments(query)
    ]);

    console.log('Found exams:', exams.length, 'total:', total);

    return { exams, total };
  }

  async findExamById(id: string): Promise<Exam> {
    const exam = await this.examModel.findOne({ _id: id, deleted_at: null }).exec();
    if (!exam) throw new NotFoundException(`Exam with ID ${id} not found`);
    return exam;
  }

  async updateExam(id: string, updateExamDto: any): Promise<Exam> {
    const exam = await this.examModel.findOneAndUpdate(
      { _id: id, deleted_at: null },
      { ...updateExamDto, updated_at: new Date() },
      { new: true }
    ).exec();
    if (!exam) throw new NotFoundException(`Exam with ID ${id} not found`);
    return exam;
  }

  async deleteExam(id: string): Promise<void> {
    const result = await this.examModel.updateOne(
      { _id: id, deleted_at: null },
      { deleted_at: new Date() }
    ).exec();
    if (result.matchedCount === 0) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }
  }

  async enterMarks(markDto: any): Promise<Mark> {
    const percentage = (markDto.marks_obtained / markDto.total_marks) * 100;
    const grade = this.calculateGrade(percentage);

    // Check if marks already exist for this student/exam/subject combination
    const existingMark = await this.markModel.findOne({
      exam_id: new Types.ObjectId(markDto.exam_id),
      student_id: new Types.ObjectId(markDto.student_id),
      subject: markDto.subject_id,
      deleted_at: null,
    }).exec();

    if (existingMark) {
      // Update existing marks
      existingMark.marks_obtained = markDto.marks_obtained;
      existingMark.percentage = percentage;
      existingMark.grade = markDto.grade || grade;
      existingMark.remarks = markDto.remarks;
      existingMark.is_absent = markDto.is_absent || false;
      existingMark.updated_at = new Date();
      return existingMark.save();
    } else {
      // Create new mark entry
      const mark = new this.markModel({
        ...markDto,
        subject: markDto.subject_id,
        percentage,
        grade: markDto.grade || grade,
      });
      return mark.save();
    }
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

  async getExamResults(
    examId: string,
    standard?: string,
    section?: string
  ): Promise<any[]> {
    const matchStage: any = {
      exam_id: new Types.ObjectId(examId),
      deleted_at: null
    };

    return this.markModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$student_id',
          subjects: {
            $push: {
              subject: '$subject',
              subject_name: '$subject',
              marks_obtained: '$marks_obtained',
              total_marks: '$total_marks',
              grade: '$grade',
              percentage: '$percentage',
            },
          },
          total_marks: { $sum: '$marks_obtained' },
          max_marks: { $sum: '$total_marks' },
        },
      },
      {
        $addFields: {
          overall_percentage: { $multiply: [{ $divide: ['$total_marks', '$max_marks'] }, 100] },
        },
      },
      {
        $addFields: {
          overall_grade: {
            $switch: {
              branches: [
                { case: { $gte: ['$overall_percentage', 90] }, then: 'A+' },
                { case: { $gte: ['$overall_percentage', 80] }, then: 'A' },
                { case: { $gte: ['$overall_percentage', 70] }, then: 'B+' },
                { case: { $gte: ['$overall_percentage', 60] }, then: 'B' },
                { case: { $gte: ['$overall_percentage', 50] }, then: 'C' },
                { case: { $gte: ['$overall_percentage', 40] }, then: 'D' },
              ],
              default: 'F',
            },
          },
        },
      },
      { $sort: { overall_percentage: -1 } },
    ]);
  }

  async publishResults(examId: string): Promise<void> {
    await this.examModel.updateOne(
      { _id: examId },
      { is_published: true, updated_at: new Date() }
    ).exec();
  }

  async exportResults(examId: string): Promise<any> {
    const results = await this.getExamResults(examId);
    // Here you would implement actual Excel export logic
    // For now, returning the data
    return results;
  }

  async getExamSchedule(examId: string, standard?: string): Promise<any[]> {
    const exam = await this.findExamById(examId);

    // This is a simplified implementation
    // In a real application, you would have a separate schedule/timetable collection
    const schedule = {
      exam_id: examId,
      exam_name: exam.name,
      start_date: exam.start_date,
      end_date: exam.end_date,
      subjects: [], // This would be populated from exam subjects or separate schedule data
    };

    return [schedule];
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
