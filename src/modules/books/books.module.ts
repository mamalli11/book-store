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
import { BookWritersEntity } from "./entities/bookWriters.entity";
import { PublisherService } from "../publisher/publisher.service";
import { BookEditorsEntity } from "./entities/bookEditors.entity";
import { TranslatorService } from "../translator/translator.service";
import { BookCategorysEntity } from "./entities/bookCategory.entity";
import { CategoryEntity } from "../category/entities/category.entity";
import { BookPublishersEntity } from "./entities/bookpublishers.entity";
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
			BookWritersEntity,
			BookEditorsEntity,
			BookCategorysEntity,
			BookPublishersEntity,
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
})
export class BooksModule {}
