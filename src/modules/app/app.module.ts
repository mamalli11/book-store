import { join } from "path";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { BooksModule } from "../books/books.module";
import { WriterModule } from "../writer/writer.module";
import { TypeOrmConfig } from "src/config/typeorm.config";
import { CategoryModule } from "../category/category.module";

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
		CategoryModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
