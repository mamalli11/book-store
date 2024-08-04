import { join } from "path";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { BooksModule } from "../books/books.module";
import { EditorModule } from "../editor/editor.module";
import { WriterModule } from "../writer/writer.module";
import { TypeOrmConfig } from "src/config/typeorm.config";
import { CategoryModule } from "../category/category.module";
import { DiscountModule } from "../discount/discount.module";
import { PublisherModule } from "../publisher/publisher.module";
import { TranslatorModule } from "../translator/translator.module";
import { CommentsModule } from "../comments/comments.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: join(process.cwd(), ".env"),
		}),
		TypeOrmModule.forRoot(TypeOrmConfig()),
		AuthModule,
		UserModule,
		BooksModule,
		WriterModule,
		EditorModule,
		CategoryModule,
		DiscountModule,
		CommentsModule,
		PublisherModule,
		TranslatorModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
