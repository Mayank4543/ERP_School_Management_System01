import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { BookIssue, BookIssueDocument } from './schemas/book-issue.schema';
import { CreateBookDto, IssueBookDto, ReturnBookDto, UpdateBookDto } from './dto/library.dto';

@Injectable()
export class LibraryService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(BookIssue.name) private bookIssueModel: Model<BookIssueDocument>,
  ) {}

  // Book Management
  async createBook(createDto: CreateBookDto): Promise<Book> {
    const book = new this.bookModel({
      ...createDto,
      school_id: new Types.ObjectId(createDto.school_id),
      available_copies: createDto.total_copies,
    });
    return book.save();
  }

  async findAllBooks(schoolId: string, category?: string, search?: string): Promise<Book[]> {
    const query: any = {
      school_id: new Types.ObjectId(schoolId),
      deleted_at: null,
    };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
      ];
    }

    return this.bookModel.find(query).sort({ title: 1 }).exec();
  }

  async findBookById(id: string): Promise<Book> {
    const book = await this.bookModel.findOne({ _id: id, deleted_at: null }).exec();
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async updateBook(id: string, updateDto: UpdateBookDto): Promise<Book> {
    const book = await this.bookModel
      .findOneAndUpdate(
        { _id: id, deleted_at: null },
        { ...updateDto, updated_at: new Date() },
        { new: true },
      )
      .exec();

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async removeBook(id: string): Promise<void> {
    const result = await this.bookModel
      .findOneAndUpdate(
        { _id: id, deleted_at: null },
        { deleted_at: new Date() },
        { new: true },
      )
      .exec();

    if (!result) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
  }

  // Book Issue Management
  async issueBook(issueDto: IssueBookDto, issuedBy: string): Promise<BookIssue> {
    const book = await this.findBookById(issueDto.book_id);

    if (book.available_copies <= 0) {
      throw new BadRequestException('No copies available for this book');
    }

    // Check if user already has this book issued
    const existingIssue = await this.bookIssueModel.findOne({
      book_id: new Types.ObjectId(issueDto.book_id),
      user_id: new Types.ObjectId(issueDto.user_id),
      status: 'issued',
      deleted_at: null,
    });

    if (existingIssue) {
      throw new BadRequestException('User already has this book issued');
    }

    const issueDays = issueDto.issue_days || 14;
    const issueDate = new Date();
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + issueDays);

    const bookIssue = new this.bookIssueModel({
      school_id: book.school_id,
      book_id: new Types.ObjectId(issueDto.book_id),
      issued_to: new Types.ObjectId(issueDto.user_id),
      user_type: issueDto.user_type,
      issue_date: issueDate,
      due_date: dueDate,
      issued_by: new Types.ObjectId(issuedBy),
      status: 'issued',
    });

    // Decrease available copies
    await this.bookModel.updateOne(
      { _id: new Types.ObjectId(issueDto.book_id) },
      { $inc: { available_copies: -1 } }
    );

    return bookIssue.save();
  }

  async returnBook(issueId: string, returnDto: ReturnBookDto, returnedTo: string): Promise<BookIssue> {
    const issue = await this.bookIssueModel.findById(issueId);
    if (!issue) {
      throw new NotFoundException('Book issue record not found');
    }

    if (issue.status === 'returned') {
      throw new BadRequestException('Book already returned');
    }

    const book = await this.findBookById(issue.book_id.toString());

    issue.return_date = new Date();
    issue.status = 'returned';
    issue.fine_amount = returnDto.fine_amount || 0;

    // Increase available copies
    await this.bookModel.updateOne(
      { _id: issue.book_id },
      { $inc: { available_copies: 1 } }
    );

    return issue.save();
  }

  async getStudentIssuedBooks(studentId: string): Promise<any[]> {
    const issues = await this.bookIssueModel
      .find({
        issued_to: new Types.ObjectId(studentId),
        user_type: 'student',
      })
      .sort({ issue_date: -1 })
      .exec();

    const booksData = await Promise.all(
      issues.map(async (issue) => {
        const book = await this.bookModel.findById(issue.book_id);
        const now = new Date();
        const isOverdue = issue.status === 'issued' && now > issue.due_date;
        const daysOverdue = isOverdue 
          ? Math.ceil((now.getTime() - issue.due_date.getTime()) / (1000 * 60 * 60 * 24))
          : 0;

        return {
          issue_id: issue._id,
          book_no: book?.book_no,
          title: book?.title,
          author: book?.author,
          issue_date: issue.issue_date,
          due_date: issue.due_date,
          return_date: issue.return_date,
          fine_amount: issue.fine_amount,
          status: isOverdue ? 'overdue' : issue.status,
          days_overdue: daysOverdue,
        };
      })
    );

    return booksData;
  }

  async getOverdueBooks(schoolId: string): Promise<any[]> {
    const now = new Date();
    
    const overdueIssues = await this.bookIssueModel
      .find({
        school_id: new Types.ObjectId(schoolId),
        status: 'issued',
        due_date: { $lt: now },
        deleted_at: null,
      })
      .sort({ due_date: 1 })
      .exec();

    const booksData = await Promise.all(
      overdueIssues.map(async (issue) => {
        const book = await this.bookModel.findById(issue.book_id);
        const daysOverdue = Math.ceil((now.getTime() - issue.due_date.getTime()) / (1000 * 60 * 60 * 24));
        const fine = daysOverdue * 5; // ₹5 per day

        // Update fine amount
        issue.fine_amount = fine;
        issue.status = 'overdue';
        await issue.save();

        return {
          issue_id: issue._id,
          user_id: issue.issued_to,
          user_type: issue.user_type,
          book_no: book?.isbn,
          title: book?.title,
          issue_date: issue.issue_date,
          due_date: issue.due_date,
          days_overdue: daysOverdue,
          fine_amount: fine,
        };
      })
    );

    return booksData;
  }

  async getLibraryStats(schoolId: string): Promise<any> {
    const totalBooks = await this.bookModel.countDocuments({
      school_id: new Types.ObjectId(schoolId),
      deleted_at: null,
    });

    const issuedBooks = await this.bookIssueModel.countDocuments({
      school_id: new Types.ObjectId(schoolId),
      status: { $in: ['issued', 'overdue'] },
      deleted_at: null,
    });

    const overdueBooks = await this.bookIssueModel.countDocuments({
      school_id: new Types.ObjectId(schoolId),
      status: 'overdue',
      deleted_at: null,
    });

    const totalCopies = await this.bookModel.aggregate([
      { $match: { school_id: new Types.ObjectId(schoolId), deleted_at: null } },
      { $group: { _id: null, total: { $sum: '$total_copies' }, available: { $sum: '$available_copies' } } }
    ]);

    return {
      total_books: totalBooks,
      total_copies: totalCopies[0]?.total || 0,
      available_copies: totalCopies[0]?.available || 0,
      issued_books: issuedBooks,
      overdue_books: overdueBooks,
    };
  }
}
