import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LibraryBook, LibraryBookSchema } from './schemas/library-book.schema';
import { BookIssue, BookIssueSchema } from './schemas/book-issue.schema';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LibraryBook.name, schema: LibraryBookSchema },
      { name: BookIssue.name, schema: BookIssueSchema },
    ]),
  ],
  controllers: [LibraryController],
  providers: [LibraryService],
  exports: [LibraryService],
})
export class LibraryModule {}
