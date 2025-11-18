import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Students (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let studentId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    // Login to get access token
    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin123!',
      });

    accessToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/v1/students (POST)', () => {
    it('should create a new student', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/students')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          school_id: '507f1f77bcf86cd799439011',
          academic_year_id: '507f1f77bcf86cd799439012',
          admission_no: 'ADM001',
          name: 'Test Student',
          father_name: 'Test Father',
          mother_name: 'Test Mother',
          dob: '2010-01-01',
          gender: 'Male',
          blood_group: 'O+',
          standard: '10',
          section: 'A',
          email: 'student@example.com',
          phone: '9876543210',
          address: 'Test Address',
        })
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.admission_no).toBe('ADM001');
      studentId = response.body._id;
    });

    it('should fail without required fields', () => {
      return request(app.getHttpServer())
        .post('/api/v1/students')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Test Student',
        })
        .expect(400);
    });
  });

  describe('/api/v1/students (GET)', () => {
    it('should get all students with pagination', () => {
      return request(app.getHttpServer())
        .get('/api/v1/students?page=1&limit=10')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('total');
          expect(Array.isArray(res.body.data)).toBeTruthy();
        });
    });
  });

  describe('/api/v1/students/:id (GET)', () => {
    it('should get student by id', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/students/${studentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body._id).toBe(studentId);
          expect(res.body).toHaveProperty('name');
        });
    });

    it('should return 404 for non-existent student', () => {
      return request(app.getHttpServer())
        .get('/api/v1/students/507f1f77bcf86cd799439999')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('/api/v1/students/:id (PATCH)', () => {
    it('should update student', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/students/${studentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Updated Student Name',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Updated Student Name');
        });
    });
  });

  describe('/api/v1/students/:id (DELETE)', () => {
    it('should delete student', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/students/${studentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return 404 after deletion', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/students/${studentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
