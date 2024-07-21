import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BooksService } from "./books.service";
import { AuthModule } from "../auth/auth.module";
import { BookEntity } from "./entities/book.entity";
import { BooksController } from "./books.controller";

@Module({
	imports: [AuthModule, TypeOrmModule.forFeature([BookEntity])],
	controllers: [BooksController],
	providers: [BooksService],
})
export class BooksModule {}
