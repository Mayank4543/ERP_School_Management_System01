import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SuperAdminController } from './super-admin.controller';
import { SuperAdminService } from './super-admin.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Teacher, TeacherSchema } from '../teachers/schemas/teacher.schema';
import { School, SchoolSchema } from '../schools/schemas/school.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Teacher.name, schema: TeacherSchema },
      { name: School.name, schema: SchoolSchema },
      { name: 'Student', schema: new (require('mongoose').Schema)({
        user_id: { type: require('mongoose').Schema.Types.ObjectId, ref: 'User' },
        school_id: { type: require('mongoose').Schema.Types.ObjectId, ref: 'School' },
        created_at: { type: Date, default: Date.now },
        deleted_at: { type: Date, default: null }
      }) }
    ])
  ],
  controllers: [SuperAdminController],
  providers: [SuperAdminService, JwtAuthGuard, RolesGuard],
  exports: [SuperAdminService]
})
export class SuperAdminModule {}