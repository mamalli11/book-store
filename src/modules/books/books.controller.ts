import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";

import { BooksService } from "./books.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { AuthGuard } from "../auth/guards/auth.guard";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";

@Controller("books")
@ApiTags("Books")
@ApiBearerAuth("Authorization")
@UseGuards(AuthGuard)
export class BooksController {
	constructor(private readonly booksService: BooksService) {}

	@Post()
	@ApiConsumes(SwaggerConsumes.UrlEncoded)
	create(@Body() createBookDto: CreateBookDto) {
		return this.booksService.create(createBookDto);
	}

	@Get()
	findAll() {
		return this.booksService.findAll();
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.booksService.findOne(+id);
	}

	@Patch(":id")
	update(@Param("id") id: string, @Body() updateBookDto: UpdateBookDto) {
		return this.booksService.update(+id, updateBookDto);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.booksService.remove(+id);
	}
}
