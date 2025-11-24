import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Section, SectionDocument } from './schemas/section.schema';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Injectable()
export class SectionsService {
  constructor(
    @InjectModel(Section.name) private sectionModel: Model<SectionDocument>,
  ) {}

  async create(createSectionDto: CreateSectionDto): Promise<Section> {
    // Check if section already exists for the same school, academic year, standard, and name
    const existingSection = await this.sectionModel.findOne({
      school_id: new Types.ObjectId(createSectionDto.school_id),
      academic_year_id: new Types.ObjectId(createSectionDto.academic_year_id),
      standard: createSectionDto.standard,
      name: createSectionDto.name.toUpperCase(),
      deleted_at: null,
    });

    if (existingSection) {
      throw new ConflictException(`Section ${createSectionDto.name} already exists for Class ${createSectionDto.standard}`);
    }

    const section = new this.sectionModel({
      ...createSectionDto,
      name: createSectionDto.name.toUpperCase(),
      school_id: new Types.ObjectId(createSectionDto.school_id),
      academic_year_id: new Types.ObjectId(createSectionDto.academic_year_id),
      class_teacher_id: createSectionDto.class_teacher_id ? new Types.ObjectId(createSectionDto.class_teacher_id) : undefined,
    });

    return section.save();
  }

  async findAll(
    schoolId: string,
    academicYearId?: string,
    standard?: number,
    isActive?: boolean,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: Section[]; total: number; page: number; totalPages: number }> {
    const query: any = {
      school_id: new Types.ObjectId(schoolId),
      deleted_at: null,
    };

    if (academicYearId && Types.ObjectId.isValid(academicYearId)) {
      query.academic_year_id = new Types.ObjectId(academicYearId);
    }

    if (standard) {
      query.standard = standard;
    }

    if (isActive !== undefined) {
      query.is_active = isActive;
    }

    const total = await this.sectionModel.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const data = await this.sectionModel
      .find(query)
      .populate('class_teacher_id', 'user_id employee_id')
      .populate({
        path: 'class_teacher_id',
        populate: {
          path: 'user_id',
          select: 'first_name last_name email',
        },
      })
      .sort({ standard: 1, name: 1 })
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

  async findById(id: string): Promise<Section> {
    const section = await this.sectionModel
      .findOne({ _id: id, deleted_at: null })
      .populate('class_teacher_id', 'user_id employee_id')
      .populate({
        path: 'class_teacher_id',
        populate: {
          path: 'user_id',
          select: 'first_name last_name email',
        },
      })
      .exec();

    if (!section) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }

    return section;
  }

  async findByStandard(schoolId: string, standard: number, academicYearId?: string): Promise<Section[]> {
    const query: any = {
      school_id: new Types.ObjectId(schoolId),
      standard,
      is_active: true,
      deleted_at: null,
    };

    if (academicYearId && Types.ObjectId.isValid(academicYearId)) {
      query.academic_year_id = new Types.ObjectId(academicYearId);
    }

    return this.sectionModel
      .find(query)
      .populate('class_teacher_id', 'user_id employee_id')
      .populate({
        path: 'class_teacher_id',
        populate: {
          path: 'user_id',
          select: 'first_name last_name email',
        },
      })
      .sort({ name: 1 })
      .exec();
  }

  async update(id: string, updateSectionDto: UpdateSectionDto): Promise<Section> {
    const updateData: any = { ...updateSectionDto };

    // Convert ObjectId fields
    if (updateSectionDto.school_id) {
      updateData.school_id = new Types.ObjectId(updateSectionDto.school_id);
    }

    if (updateSectionDto.academic_year_id) {
      updateData.academic_year_id = new Types.ObjectId(updateSectionDto.academic_year_id);
    }

    if (updateSectionDto.class_teacher_id) {
      updateData.class_teacher_id = new Types.ObjectId(updateSectionDto.class_teacher_id);
    }

    if (updateSectionDto.name) {
      updateData.name = updateSectionDto.name.toUpperCase();

      // Check for duplicate section name
      const existingSection = await this.sectionModel.findOne({
        _id: { $ne: id },
        school_id: updateData.school_id || undefined,
        academic_year_id: updateData.academic_year_id || undefined,
        standard: updateSectionDto.standard || undefined,
        name: updateData.name,
        deleted_at: null,
      });

      if (existingSection) {
        throw new ConflictException(`Section ${updateSectionDto.name} already exists`);
      }
    }

    const section = await this.sectionModel
      .findOneAndUpdate(
        { _id: id, deleted_at: null },
        updateData,
        { new: true, runValidators: true },
      )
      .populate('class_teacher_id', 'user_id employee_id')
      .populate({
        path: 'class_teacher_id',
        populate: {
          path: 'user_id',
          select: 'first_name last_name email',
        },
      })
      .exec();

    if (!section) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }

    return section;
  }

  async remove(id: string): Promise<void> {
    const result = await this.sectionModel
      .findOneAndUpdate(
        { _id: id, deleted_at: null },
        { deleted_at: new Date(), is_active: false },
        { new: true },
      )
      .exec();

    if (!result) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }
  }

  async updateStudentCount(sectionId: string): Promise<void> {
    // This would be called when students are added/removed
    // For now, we'll implement a basic count update
    // In a real implementation, you'd count from Student collection
    
    const section = await this.findById(sectionId);
    
    // TODO: Implement actual student count from Student collection
    // const studentCount = await this.studentModel.countDocuments({
    //   section_id: new Types.ObjectId(sectionId),
    //   deleted_at: null
    // });
    
    // For now, just ensure the section exists
    // await this.sectionModel.findByIdAndUpdate(sectionId, {
    //   current_strength: studentCount
    // });
  }

  async getSectionsByTeacher(teacherId: string, academicYearId?: string): Promise<Section[]> {
    const query: any = {
      class_teacher_id: new Types.ObjectId(teacherId),
      is_active: true,
      deleted_at: null,
    };

    if (academicYearId && Types.ObjectId.isValid(academicYearId)) {
      query.academic_year_id = new Types.ObjectId(academicYearId);
    }

    return this.sectionModel
      .find(query)
      .sort({ standard: 1, name: 1 })
      .exec();
  }
}