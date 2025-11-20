import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UserProfile, UserProfileDocument } from './schemas/user-profile.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserProfile.name) private userProfileModel: Model<UserProfileDocument>,
    @InjectModel('School') private schoolModel: Model<any>,
  ) { }

  async create(createUserDto: any): Promise<User> {
    // Hash password if provided
    if (createUserDto.password) {
      createUserDto.password = await this.hashPassword(createUserDto.password);
    }

    // Set school_id as ObjectId if it's a string
    if (createUserDto.school_id && typeof createUserDto.school_id === 'string') {
      createUserDto.school_id = new Types.ObjectId(createUserDto.school_id);
    }

    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(schoolId: string, query: any = {}): Promise<User[]> {
    return this.userModel
      .find({ school_id: new Types.ObjectId(schoolId), deleted_at: null, ...query })
      .populate('profile')
      .exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel
      .findOne({ _id: new Types.ObjectId(id), deleted_at: null })
      .populate('profile')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel
      .findOne({ email: email.toLowerCase(), deleted_at: null })
      .populate('profile')
      .exec();
  }

  async update(id: string, updateUserDto: any): Promise<User> {
    const updatedUser = await this.userModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id), deleted_at: null },
        { $set: updateUserDto },
        { new: true },
      )
      .populate('profile')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel
      .updateOne({ _id: new Types.ObjectId(id) }, { $set: { deleted_at: new Date() } })
      .exec();

    if (result.modifiedCount === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async hashPassword(password: string): Promise<string> {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
    return bcrypt.hash(password, rounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async createProfile(userId: string, profileData: any): Promise<UserProfile> {
    const profile = new this.userProfileModel({
      user_id: new Types.ObjectId(userId),
      ...profileData,
    });
    return profile.save();
  }

  async updateProfile(userId: string, profileData: any): Promise<UserProfile> {
    const updatedProfile = await this.userProfileModel
      .findOneAndUpdate(
        { user_id: new Types.ObjectId(userId), deleted_at: null },
        { $set: profileData },
        { new: true, upsert: true },
      )
      .exec();

    return updatedProfile;
  }

  async getOrCreateDefaultSchool(): Promise<any> {
    // Try to find an existing school
    let school = await this.schoolModel.findOne().exec();

    // If no school exists, create a default one
    if (!school) {
      school = await this.schoolModel.create({
        name: 'Default School',
        slug: 'default-school',
        email: 'admin@defaultschool.com',
        phone: '0000000000',
        address: 'Default Address',
        country_id: new Types.ObjectId(),
        state_id: new Types.ObjectId(),
        city_id: new Types.ObjectId(),
        pincode: '000000',
        status: 1,
      });
    }

    return school;
  }
}
