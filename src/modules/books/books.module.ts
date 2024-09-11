import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { S3Service } from "../s3/s3.service";
import { BooksService } from "./books.service";
import { AuthModule } from "../auth/auth.module";
import { BookEntity } from "./entities/book.entity";
import { BooksController } from "./books.controller";
import { WriterService } from "../writer/writer.service";
import { EditorService } from "../editor/editor.service";
import { ImagesBookEntity } from "./entities/images.entity";
import { CategoryService } from "../category/category.service";
import { EditorEntity } from "../editor/entities/editor.entity";
import { WriterEntity } from "../writer/entities/writer.entity";
import { BookBookmarkEntity } from "./entities/bookmark.entity";
import { BookWritersEntity } from "./entities/bookWriters.entity";
import { PublisherService } from "../publisher/publisher.service";
import { BookEditorsEntity } from "./entities/bookEditors.entity";
import { TranslatorService } from "../translator/translator.service";
import { BookCategorysEntity } from "./entities/bookCategory.entity";
import { CategoryEntity } from "../category/entities/category.entity";
import { BookWantToReadEntity } from "./entities/bookWantToRead.entity";
import { BookPublishersEntity } from "./entities/bookPublishers.entity";
import { PublisherEntity } from "../publisher/entities/publisher.entity";
import { BookTranslatorsEntity } from "./entities/bookTranslators.entity";
import { TranslatorEntity } from "../translator/entities/translator.entity";

@Module({
	imports: [
		AuthModule,
		TypeOrmModule.forFeature([
			BookEntity,
			EditorEntity,
			WriterEntity,
			CategoryEntity,
			PublisherEntity,
			ImagesBookEntity,
			TranslatorEntity,
			BookWritersEntity,
			BookEditorsEntity,
			BookBookmarkEntity,
			BookCategorysEntity,
			BookPublishersEntity,
			BookWantToReadEntity,
			BookTranslatorsEntity,
		]),
	],
	controllers: [BooksController],
	providers: [
		S3Service,
		BooksService,
		EditorService,
		WriterService,
		CategoryService,
		PublisherService,
		TranslatorService,
	],
	exports: [BooksService, TypeOrmModule],
})
export class BooksModule {}
