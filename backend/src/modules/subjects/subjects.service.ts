import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Subject, SubjectDocument } from './schemas/subject.schema';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const subject = new this.subjectModel({
      ...createSubjectDto,
      school_id: new Types.ObjectId(createSubjectDto.school_id),
      academic_year_id: new Types.ObjectId(createSubjectDto.academic_year_id),
      code: createSubjectDto.code.toUpperCase(),
    });
    
    return subject.save();
  }

  async findAll(
    schoolId: string,
    academicYearId?: string,
    standard?: number,
    type?: string,
    status: string = 'active',
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: Subject[]; total: number; page: number; totalPages: number }> {
    const query: any = {
      school_id: new Types.ObjectId(schoolId),
      status,
      deleted_at: null,
    };

    if (academicYearId && Types.ObjectId.isValid(academicYearId)) {
      query.academic_year_id = new Types.ObjectId(academicYearId);
    }

    if (standard) {
      query.standards = standard;
    }

    if (type) {
      query.type = type;
    }

    const total = await this.subjectModel.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const data = await this.subjectModel
      .find(query)
      .sort({ name: 1 })
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

  async findById(id: string): Promise<Subject> {
    const subject = await this.subjectModel
      .findOne({ _id: id, deleted_at: null })
      .exec();

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }

    return subject;
  }

  async findByCode(code: string): Promise<Subject> {
    const subject = await this.subjectModel
      .findOne({ code: code.toUpperCase(), deleted_at: null })
      .exec();

    if (!subject) {
      throw new NotFoundException(`Subject with code ${code} not found`);
    }

    return subject;
  }

  async findByStandard(schoolId: string, standard: number, academicYearId?: string): Promise<Subject[]> {
    const query: any = {
      school_id: new Types.ObjectId(schoolId),
      standards: standard,
      status: 'active',
      deleted_at: null,
    };

    if (academicYearId && Types.ObjectId.isValid(academicYearId)) {
      query.academic_year_id = new Types.ObjectId(academicYearId);
    }

    return this.subjectModel
      .find(query)
      .sort({ name: 1 })
      .exec();
  }

  async update(id: string, updateSubjectDto: UpdateSubjectDto): Promise<Subject> {
    const updateData: any = { ...updateSubjectDto };

    if (updateSubjectDto.school_id) {
      updateData.school_id = new Types.ObjectId(updateSubjectDto.school_id);
    }

    if (updateSubjectDto.academic_year_id) {
      updateData.academic_year_id = new Types.ObjectId(updateSubjectDto.academic_year_id);
    }

    if (updateSubjectDto.code) {
      updateData.code = updateSubjectDto.code.toUpperCase();
    }

    const subject = await this.subjectModel
      .findOneAndUpdate(
        { _id: id, deleted_at: null },
        updateData,
        { new: true, runValidators: true },
      )
      .exec();

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }

    return subject;
  }

  async remove(id: string): Promise<void> {
    const result = await this.subjectModel
      .findOneAndUpdate(
        { _id: id, deleted_at: null },
        { deleted_at: new Date() },
        { new: true },
      )
      .exec();

    if (!result) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
  }

  async getSubjectsByType(schoolId: string, type: string, academicYearId?: string): Promise<Subject[]> {
    const query: any = {
      school_id: new Types.ObjectId(schoolId),
      type,
      status: 'active',
      deleted_at: null,
    };

    if (academicYearId && Types.ObjectId.isValid(academicYearId)) {
      query.academic_year_id = new Types.ObjectId(academicYearId);
    }

    return this.subjectModel
      .find(query)
      .sort({ name: 1 })
      .exec();
  }
}