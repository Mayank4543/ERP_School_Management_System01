import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AcademicYear, AcademicYearDocument } from './schemas/academic-year.schema';
import { CreateAcademicYearDto, UpdateAcademicYearDto } from './dto/academic-year.dto';

@Injectable()
export class AcademicService {
  constructor(
    @InjectModel(AcademicYear.name) private academicYearModel: Model<AcademicYearDocument>,
  ) {}

  async findAll(schoolId: string): Promise<AcademicYear[]> {
    return this.academicYearModel
      .find({ school_id: new Types.ObjectId(schoolId), deleted_at: null })
      .sort({ start_date: -1 })
      .exec();
  }

  async findCurrent(schoolId: string): Promise<AcademicYear> {
    return this.academicYearModel
      .findOne({ school_id: new Types.ObjectId(schoolId), is_current: true, deleted_at: null })
      .exec();
  }

  async create(schoolId: string, createAcademicYearDto: CreateAcademicYearDto): Promise<AcademicYear> {
    const { name, start_date, end_date, is_current = false, status = 'active' } = createAcademicYearDto;

    // Validate dates
    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestException('Start date must be before end date');
    }

    // If setting as current, unset other current years
    if (is_current) {
      await this.academicYearModel.updateMany(
        { school_id: new Types.ObjectId(schoolId), deleted_at: null },
        { is_current: false }
      );
    }

    // Check for overlapping academic years
    const overlapping = await this.academicYearModel.findOne({
      school_id: new Types.ObjectId(schoolId),
      deleted_at: null,
      $or: [
        { start_date: { $lte: new Date(end_date) }, end_date: { $gte: new Date(start_date) } }
      ]
    });

    if (overlapping) {
      throw new BadRequestException('Academic year dates overlap with existing academic year');
    }

    const academicYear = new this.academicYearModel({
      school_id: new Types.ObjectId(schoolId),
      name,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      is_current,
      status,
    });

    return academicYear.save();
  }

  async update(schoolId: string, id: string, updateAcademicYearDto: UpdateAcademicYearDto): Promise<AcademicYear> {
    const academicYear = await this.academicYearModel.findOne({
      _id: new Types.ObjectId(id),
      school_id: new Types.ObjectId(schoolId),
      deleted_at: null,
    });

    if (!academicYear) {
      throw new NotFoundException('Academic year not found');
    }

    // Validate dates if provided
    if (updateAcademicYearDto.start_date && updateAcademicYearDto.end_date) {
      if (new Date(updateAcademicYearDto.start_date) >= new Date(updateAcademicYearDto.end_date)) {
        throw new BadRequestException('Start date must be before end date');
      }
    } else if (updateAcademicYearDto.start_date && new Date(updateAcademicYearDto.start_date) >= academicYear.end_date) {
      throw new BadRequestException('Start date must be before current end date');
    } else if (updateAcademicYearDto.end_date && academicYear.start_date >= new Date(updateAcademicYearDto.end_date)) {
      throw new BadRequestException('End date must be after current start date');
    }

    // If setting as current, unset other current years
    if (updateAcademicYearDto.is_current) {
      await this.academicYearModel.updateMany(
        { school_id: new Types.ObjectId(schoolId), deleted_at: null, _id: { $ne: new Types.ObjectId(id) } },
        { is_current: false }
      );
    }

    Object.assign(academicYear, updateAcademicYearDto);
    
    if (updateAcademicYearDto.start_date) {
      academicYear.start_date = new Date(updateAcademicYearDto.start_date);
    }
    
    if (updateAcademicYearDto.end_date) {
      academicYear.end_date = new Date(updateAcademicYearDto.end_date);
    }

    return academicYear.save();
  }

  async remove(schoolId: string, id: string): Promise<void> {
    const academicYear = await this.academicYearModel.findOne({
      _id: new Types.ObjectId(id),
      school_id: new Types.ObjectId(schoolId),
      deleted_at: null,
    });

    if (!academicYear) {
      throw new NotFoundException('Academic year not found');
    }

    if (academicYear.is_current) {
      throw new BadRequestException('Cannot delete the current academic year');
    }

    academicYear.deleted_at = new Date();
    await academicYear.save();
  }

  async setCurrent(schoolId: string, id: string): Promise<AcademicYear> {
    const academicYear = await this.academicYearModel.findOne({
      _id: new Types.ObjectId(id),
      school_id: new Types.ObjectId(schoolId),
      deleted_at: null,
    });

    if (!academicYear) {
      throw new NotFoundException('Academic year not found');
    }

    // Unset other current years
    await this.academicYearModel.updateMany(
      { school_id: new Types.ObjectId(schoolId), deleted_at: null },
      { is_current: false }
    );

    academicYear.is_current = true;
    return academicYear.save();
  }
}
