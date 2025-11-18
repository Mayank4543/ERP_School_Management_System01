import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Timetable, TimetableDocument } from './schemas/timetable.schema';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';

@Injectable()
export class TimetableService {
  constructor(
    @InjectModel(Timetable.name) private timetableModel: Model<TimetableDocument>,
  ) {}

  async create(createTimetableDto: CreateTimetableDto): Promise<Timetable> {
    const timetable = new this.timetableModel({
      ...createTimetableDto,
      school_id: new Types.ObjectId(createTimetableDto.school_id),
      academic_year_id: new Types.ObjectId(createTimetableDto.academic_year_id),
      section_id: new Types.ObjectId(createTimetableDto.section_id),
      periods: createTimetableDto.periods.map(period => ({
        ...period,
        subject_id: period.subject_id ? new Types.ObjectId(period.subject_id) : undefined,
        teacher_id: period.teacher_id ? new Types.ObjectId(period.teacher_id) : undefined,
      })),
    });
    return timetable.save();
  }

  async findAll(
    schoolId: string,
    academicYearId?: string,
    standard?: number,
    sectionId?: string,
    day?: string,
  ): Promise<Timetable[]> {
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

    if (sectionId) {
      query.section_id = new Types.ObjectId(sectionId);
    }

    if (day) {
      query.day = day;
    }

    return this.timetableModel
      .find(query)
      .sort({ day: 1, 'periods.period_number': 1 })
      .exec();
  }

  async findById(id: string): Promise<Timetable> {
    const timetable = await this.timetableModel
      .findOne({ _id: id, deleted_at: null })
      .exec();

    if (!timetable) {
      throw new NotFoundException(`Timetable with ID ${id} not found`);
    }

    return timetable;
  }

  async findByClass(
    schoolId: string,
    academicYearId: string,
    standard: number,
    sectionId: string,
  ): Promise<Timetable[]> {
    return this.timetableModel
      .find({
        school_id: new Types.ObjectId(schoolId),
        academic_year_id: new Types.ObjectId(academicYearId),
        standard,
        section_id: new Types.ObjectId(sectionId),
        deleted_at: null,
      })
      .sort({ day: 1 })
      .exec();
  }

  async findStudentTimetable(studentId: string): Promise<any> {
    // First get student details to find their class and section
    const { default: axios } = await import('axios');
    
    // This would ideally use a student service instead of axios
    // For now, we'll need to populate this with student data
    // In production, inject StudentsService
    
    return {
      message: 'Student timetable endpoint - needs student service integration',
      studentId,
    };
  }

  async findTeacherTimetable(
    schoolId: string,
    academicYearId: string,
    teacherId: string,
  ): Promise<any[]> {
    const timetables = await this.timetableModel
      .find({
        school_id: new Types.ObjectId(schoolId),
        academic_year_id: new Types.ObjectId(academicYearId),
        'periods.teacher_id': new Types.ObjectId(teacherId),
        deleted_at: null,
      })
      .exec();

    // Flatten and organize by day
    const schedule = timetables.map(tt => ({
      day: tt.day,
      periods: tt.periods.filter(p => p.teacher_id?.toString() === teacherId),
    }));

    return schedule;
  }

  async update(id: string, updateTimetableDto: UpdateTimetableDto): Promise<Timetable> {
    const updateData: any = { ...updateTimetableDto, updated_at: new Date() };

    if (updateTimetableDto.school_id) {
      updateData.school_id = new Types.ObjectId(updateTimetableDto.school_id);
    }
    if (updateTimetableDto.academic_year_id) {
      updateData.academic_year_id = new Types.ObjectId(updateTimetableDto.academic_year_id);
    }
    if (updateTimetableDto.section_id) {
      updateData.section_id = new Types.ObjectId(updateTimetableDto.section_id);
    }
    if (updateTimetableDto.periods) {
      updateData.periods = updateTimetableDto.periods.map(period => ({
        ...period,
        subject_id: period.subject_id ? new Types.ObjectId(period.subject_id) : undefined,
        teacher_id: period.teacher_id ? new Types.ObjectId(period.teacher_id) : undefined,
      }));
    }

    const timetable = await this.timetableModel
      .findOneAndUpdate(
        { _id: id, deleted_at: null },
        updateData,
        { new: true },
      )
      .exec();

    if (!timetable) {
      throw new NotFoundException(`Timetable with ID ${id} not found`);
    }

    return timetable;
  }

  async remove(id: string): Promise<void> {
    const result = await this.timetableModel
      .findOneAndUpdate(
        { _id: id, deleted_at: null },
        { deleted_at: new Date() },
        { new: true },
      )
      .exec();

    if (!result) {
      throw new NotFoundException(`Timetable with ID ${id} not found`);
    }
  }

  // Get today's timetable for a class
  async getTodayTimetable(
    schoolId: string,
    academicYearId: string,
    standard: number,
    sectionId: string,
  ): Promise<Timetable | null> {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];

    if (today === 'Sunday') {
      return null; // No classes on Sunday
    }

    return this.timetableModel
      .findOne({
        school_id: new Types.ObjectId(schoolId),
        academic_year_id: new Types.ObjectId(academicYearId),
        standard,
        section_id: new Types.ObjectId(sectionId),
        day: today,
        deleted_at: null,
      })
      .exec();
  }
}
