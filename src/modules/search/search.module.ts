import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SearchService } from "./search.service";
import { BooksModule } from "../books/books.module";
import { SearchController } from "./search.controller";
import { WriterEntity } from "../writer/entities/writer.entity";
import { EditorEntity } from "../editor/entities/editor.entity";
import { PublisherEntity } from "../publisher/entities/publisher.entity";
import { TranslatorEntity } from "../translator/entities/translator.entity";

@Module({
	imports: [
		BooksModule,
		TypeOrmModule.forFeature([TranslatorEntity, WriterEntity, PublisherEntity, EditorEntity]),
	],
	controllers: [SearchController],
	providers: [SearchService],
})
export class SearchModule {}
