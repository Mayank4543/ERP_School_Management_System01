import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LibraryBook, LibraryBookSchema } from './schemas/library-book.schema';
import { BookIssue, BookIssueSchema } from './schemas/book-issue.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LibraryBook.name, schema: LibraryBookSchema },
      { name: BookIssue.name, schema: BookIssueSchema },
    ]),
  ],
})
export class LibraryModule {}
