import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { getModelToken } from '@nestjs/mongoose';
import { Student } from './schemas/student.schema';
import { Model } from 'mongoose';

describe('StudentsService', () => {
  let service: StudentsService;
  let model: Model<Student>;

  const mockStudent = {
    _id: '123',
    school_id: 'school123',
    academic_year_id: 'ay123',
    admission_no: 'ADM001',
    name: 'John Doe',
    father_name: 'Robert Doe',
    mother_name: 'Jane Doe',
    email: 'john@example.com',
    phone: '9876543210',
    standard: '10',
    section: 'A',
    status: 'active',
  };

  const mockStudentModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: getModelToken(Student.name),
          useValue: mockStudentModel,
        },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
    model = module.get<Model<Student>>(getModelToken(Student.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new student', async () => {
      mockStudentModel.create.mockResolvedValue(mockStudent);

      const result = await service.create({
        school_id: 'school123',
        academic_year_id: 'ay123',
        admission_no: 'ADM001',
        name: 'John Doe',
        father_name: 'Robert Doe',
        mother_name: 'Jane Doe',
        email: 'john@example.com',
        phone: '9876543210',
        standard: '10',
        section: 'A',
      } as any);

      expect(result).toEqual(mockStudent);
      expect(mockStudentModel.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated students', async () => {
      const mockStudents = [mockStudent];
      
      mockStudentModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockStudents),
            }),
          }),
        }),
      });

      mockStudentModel.countDocuments.mockResolvedValue(1);

      const result = await service.findAll('school123', undefined, undefined, 1, 10);

      expect(result.data).toEqual(mockStudents);
      expect(result.total).toBe(1);
    });
  });

  describe('findById', () => {
    it('should return a student by id', async () => {
      mockStudentModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockStudent),
      });

      const result = await service.findById('123');

      expect(result).toEqual(mockStudent);
      expect(mockStudentModel.findById).toHaveBeenCalledWith('123');
    });

    it('should return null if student not found', async () => {
      mockStudentModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.findById('999');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a student', async () => {
      const updatedStudent = { ...mockStudent, name: 'John Updated' };
      
      mockStudentModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedStudent),
      });

      const result = await service.update('123', { name: 'John Updated' } as any);

      expect(result).toBeDefined();
      expect(result).toEqual(updatedStudent);
      expect(mockStudentModel.findByIdAndUpdate).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a student', async () => {
      mockStudentModel.findByIdAndDelete.mockResolvedValue(mockStudent);

      await service.remove('123');

      expect(mockStudentModel.findByIdAndDelete).toHaveBeenCalledWith('123');
    });
  });
});
