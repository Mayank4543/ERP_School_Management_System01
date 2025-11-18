import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Assignment, AssignmentDocument } from './schemas/assignment.schema';
import { AssignmentSubmission, AssignmentSubmissionDocument } from './schemas/assignment-submission.schema';
import { CreateAssignmentDto, SubmitAssignmentDto, GradeAssignmentDto } from './dto/assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectModel(Assignment.name) private assignmentModel: Model<AssignmentDocument>,
    @InjectModel(AssignmentSubmission.name) private submissionModel: Model<AssignmentSubmissionDocument>,
  ) {}

  async create(createDto: CreateAssignmentDto): Promise<Assignment> {
    const assignment = new this.assignmentModel({
      ...createDto,
      school_id: new Types.ObjectId(createDto.school_id),
      academic_year_id: new Types.ObjectId(createDto.academic_year_id),
      subject_id: new Types.ObjectId(createDto.subject_id),
      section_id: new Types.ObjectId(createDto.section_id),
      teacher_id: new Types.ObjectId(createDto.teacher_id),
      assigned_date: new Date(),
    });
    return assignment.save();
  }

  async findAll(schoolId: string, academicYearId?: string, standard?: number): Promise<Assignment[]> {
    const query: any = {
      school_id: new Types.ObjectId(schoolId),
      deleted_at: null,
    };
    if (academicYearId) query.academic_year_id = new Types.ObjectId(academicYearId);
    if (standard) query.standard = standard;

    return this.assignmentModel.find(query).sort({ due_date: 1 }).exec();
  }

  async findStudentAssignments(studentId: string, status?: string): Promise<any[]> {
    // Get student class info first (would need StudentsService)
    // For now, return all assignments and check submissions
    
    const assignments = await this.assignmentModel
      .find({ deleted_at: null, status: 'active' })
      .sort({ due_date: 1 })
      .exec();

    // Get submissions for this student
    const submissions = await this.submissionModel
      .find({ student_id: new Types.ObjectId(studentId), deleted_at: null })
      .exec();

    const submissionMap = new Map(submissions.map(s => [s.assignment_id.toString(), s]));

    return assignments.map(assignment => {
      const submission = submissionMap.get(assignment._id.toString());
      const now = new Date();
      const daysLeft = Math.ceil((new Date(assignment.due_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        ...assignment.toObject(),
        submission_status: submission?.status || 'pending',
        submitted_at: submission?.submitted_at,
        marks_obtained: submission?.marks_obtained,
        daysLeft,
        priority: daysLeft <= 2 ? 'high' : daysLeft <= 5 ? 'medium' : 'low',
      };
    });
  }

  async submitAssignment(assignmentId: string, studentId: string, submitDto: SubmitAssignmentDto): Promise<AssignmentSubmission> {
    const assignment = await this.assignmentModel.findById(assignmentId);
    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    const now = new Date();
    const isLate = now > assignment.due_date;

    const submission = new this.submissionModel({
      assignment_id: new Types.ObjectId(assignmentId),
      student_id: new Types.ObjectId(studentId),
      submitted_at: now,
      is_late: isLate,
      status: 'submitted',
      ...submitDto,
    });

    return submission.save();
  }

  async gradeSubmission(submissionId: string, teacherId: string, gradeDto: GradeAssignmentDto): Promise<AssignmentSubmission> {
    const submission = await this.submissionModel.findById(submissionId);
    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    submission.marks_obtained = gradeDto.marks_obtained;
    submission.remarks = gradeDto.remarks;
    submission.status = 'graded';

    return submission.save();
  }

  async getSubmissions(assignmentId: string): Promise<AssignmentSubmission[]> {
    return this.submissionModel
      .find({ assignment_id: new Types.ObjectId(assignmentId), deleted_at: null })
      .exec();
  }

  private calculateGrade(marks: number): string {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C';
    return 'D';
  }
}
