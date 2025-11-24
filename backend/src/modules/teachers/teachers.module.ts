import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';
import { Teacher, TeacherSchema } from './schemas/teacher.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UserProfile, UserProfileSchema } from '../users/schemas/user-profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Teacher.name, schema: TeacherSchema },
      { name: User.name, schema: UserSchema },
      { name: UserProfile.name, schema: UserProfileSchema },
    ]),
  ],
  controllers: [TeachersController],
  providers: [TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}
