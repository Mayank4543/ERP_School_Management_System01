import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SchoolsModule } from './modules/schools/schools.module';
import { AcademicModule } from './modules/academic/academic.module';
import { StudentsModule } from './modules/students/students.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { ExamsModule } from './modules/exams/exams.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { HomeworkModule } from './modules/homework/homework.module';
import { LessonPlansModule } from './modules/lesson-plans/lesson-plans.module';
import { TimetableModule } from './modules/timetable/timetable.module';
import { FeesModule } from './modules/fees/fees.module';
import { LibraryModule } from './modules/library/library.module';
import { TransportModule } from './modules/transport/transport.module';
import { CommunicationModule } from './modules/communication/communication.module';
import { EventsModule } from './modules/events/events.module';
import { LeavesModule } from './modules/leaves/leaves.module';
import { PayrollModule } from './modules/payroll/payroll.module';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { EmailModule } from './modules/notifications/email/email.module';
import { SmsModule } from './modules/notifications/sms/sms.module';
import { WebsocketModule } from './modules/notifications/websocket/websocket.module';
import { PdfModule } from './modules/reports/pdf/pdf.module';
import { ExcelModule } from './modules/reports/excel/excel.module';
import { RedisModule } from './modules/cache/redis.module';
import { QueueModule } from './modules/queues/queue.module';
import { ActivityLogModule } from './modules/activity-log/activity-log.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ReportsModule } from './modules/reports/reports.module';
import { UploadModule } from './modules/upload/upload.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // MongoDB Connection
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        retryAttempts: 5,
        retryDelay: 1000,
      }),
    }),

    // Core Modules
    AuthModule,
    UsersModule,
    SchoolsModule,
    AcademicModule,
    
    // Academic Modules
    StudentsModule,
    TeachersModule,
    AttendanceModule,
    ExamsModule,
    AssignmentsModule,
    HomeworkModule,
    LessonPlansModule,
    TimetableModule,
    
    // Management Modules
    FeesModule,
    LibraryModule,
    TransportModule,
    CommunicationModule,
    EventsModule,
    LeavesModule,
    PayrollModule,
    SuperAdminModule,

    // Notification Modules
    NotificationsModule,
    EmailModule,
    SmsModule,
    WebsocketModule,

    // Report Modules
    PdfModule,
    ExcelModule,

    // Cache & Queue Modules
    RedisModule,
    QueueModule,

    // Activity Log Module
    ActivityLogModule,

    // Dashboard Module
    DashboardModule,

    // Reports Module
    ReportsModule,

    // Upload Module
    UploadModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
