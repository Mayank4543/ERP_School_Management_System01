import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { LibraryService } from './library.service';
import { CreateBookDto, IssueBookDto, ReturnBookDto, UpdateBookDto } from './dto/library.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Library')
@ApiBearerAuth()
@Controller('library')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  // Book Management
  @Post('books')
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Add new book' })
  @ApiResponse({ status: 201, description: 'Book added successfully' })
  async createBook(@Body() createDto: CreateBookDto) {
    const book = await this.libraryService.createBook(createDto);
    return {
      success: true,
      message: 'Book added successfully',
      data: book,
    };
  }

  @Get('books')
  @ApiOperation({ summary: 'Get all books' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'search', required: false })
  async findAllBooks(
    @CurrentUser() user: any,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    const books = await this.libraryService.findAllBooks(user.schoolId, category, search);
    return {
      success: true,
      data: books,
    };
  }

  @Get('books/:id')
  @ApiOperation({ summary: 'Get book by ID' })
  @ApiResponse({ status: 200, description: 'Book found' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async findBook(@Param('id') id: string) {
    const book = await this.libraryService.findBookById(id);
    return {
      success: true,
      data: book,
    };
  }

  @Patch('books/:id')
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Update book' })
  @ApiResponse({ status: 200, description: 'Book updated successfully' })
  async updateBook(@Param('id') id: string, @Body() updateDto: UpdateBookDto) {
    const book = await this.libraryService.updateBook(id, updateDto);
    return {
      success: true,
      message: 'Book updated successfully',
      data: book,
    };
  }

  @Delete('books/:id')
  @Roles('admin', 'librarian')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete book (soft delete)' })
  @ApiResponse({ status: 204, description: 'Book deleted successfully' })
  async removeBook(@Param('id') id: string) {
    await this.libraryService.removeBook(id);
  }

  // Book Issue Management
  @Post('issue')
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Issue book to student/teacher' })
  @ApiResponse({ status: 201, description: 'Book issued successfully' })
  async issueBook(@Body() issueDto: IssueBookDto, @CurrentUser() user: any) {
    const issue = await this.libraryService.issueBook(issueDto, user._id);
    return {
      success: true,
      message: 'Book issued successfully',
      data: issue,
    };
  }

  @Post('return/:issueId')
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Return book' })
  @ApiResponse({ status: 200, description: 'Book returned successfully' })
  async returnBook(
    @Param('issueId') issueId: string,
    @Body() returnDto: ReturnBookDto,
    @CurrentUser() user: any,
  ) {
    const issue = await this.libraryService.returnBook(issueId, returnDto, user._id);
    return {
      success: true,
      message: 'Book returned successfully',
      data: issue,
    };
  }

  @Get('student/:studentId/issued')
  @ApiOperation({ summary: 'Get student issued books' })
  @ApiResponse({ status: 200, description: 'Student issued books retrieved' })
  async getStudentIssuedBooks(@Param('studentId') studentId: string) {
    const books = await this.libraryService.getStudentIssuedBooks(studentId);
    return {
      success: true,
      data: books,
    };
  }

  @Get('overdue')
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Get overdue books' })
  @ApiResponse({ status: 200, description: 'Overdue books retrieved' })
  async getOverdueBooks(@CurrentUser() user: any) {
    const books = await this.libraryService.getOverdueBooks(user.schoolId);
    return {
      success: true,
      data: books,
    };
  }

  @Get('stats')
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Get library statistics' })
  async getLibraryStats(@CurrentUser() user: any) {
    const stats = await this.libraryService.getLibraryStats(user.schoolId);
    return {
      success: true,
      data: stats,
    };
  }
}
