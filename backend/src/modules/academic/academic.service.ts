import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AcademicYear, AcademicYearDocument } from './schemas/academic-year.schema';

@Injectable()
export class AcademicService {
  constructor(
    @InjectModel(AcademicYear.name) private academicYearModel: Model<AcademicYearDocument>,
  ) {}

  async findAll(schoolId: string): Promise<AcademicYear[]> {
    return this.academicYearModel
      .find({ school_id: new Types.ObjectId(schoolId), deleted_at: null })
      .exec();
  }

  async findCurrent(schoolId: string): Promise<AcademicYear> {
    return this.academicYearModel
      .findOne({ school_id: new Types.ObjectId(schoolId), is_current: true, deleted_at: null })
      .exec();
  }
}
