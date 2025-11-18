import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { School, SchoolDocument } from './schemas/school.schema';

@Injectable()
export class SchoolsService {
  constructor(@InjectModel(School.name) private schoolModel: Model<SchoolDocument>) {}

  async findAll(): Promise<School[]> {
    return this.schoolModel.find({ deleted_at: null }).exec();
  }

  async findById(id: string): Promise<School> {
    return this.schoolModel.findOne({ _id: id, deleted_at: null }).exec();
  }
}
