import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { winstonLogger } from './config/winston.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });
  const configService = app.get(ConfigService);

  // Global prefix
  const apiPrefix = configService.get('API_PREFIX') || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // Enable CORS
  const corsOrigin = configService.get('CORS_ORIGIN')?.split(',') || ['http://localhost:3000', 'http://localhost:3001'];
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-School-Id'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('GegoK12 ERP API')
    .setDescription('School ERP Management System - Complete API Documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('Users', 'User management')
    .addTag('Schools', 'School management')
    .addTag('Academic', 'Academic year and class management')
    .addTag('Students', 'Student management and records')
    .addTag('Teachers', 'Teacher management')
    .addTag('Attendance', 'Attendance tracking')
    .addTag('Exams', 'Exam and marks management')
    .addTag('Assignments', 'Assignment management')
    .addTag('Homework', 'Homework tracking')
    .addTag('Lesson Plans', 'Lesson planning')
    .addTag('Timetable', 'Class schedules')
    .addTag('Fees', 'Fee management')
    .addTag('Library', 'Library management')
    .addTag('Transport', 'Transport management')
    .addTag('Communication', 'Notices and messages')
    .addTag('Events', 'Events management')
    .addTag('Leaves', 'Leave management')
    .addTag('Payroll', 'Payroll and salary management')
    .addTag('Activity Logs', 'User activity tracking')
    .addTag('Notifications', 'Email, SMS, and real-time notifications')
    .addTag('Reports', 'PDF and Excel reports')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  });
  const port = configService.get('PORT') || 8080;

  await app.listen(port, '0.0.0.0');

  console.log(`Application running on: http://localhost:${port}`);
  console.log(`API endpoint: http://localhost:${port}/${apiPrefix}`);
  console.log(`Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
