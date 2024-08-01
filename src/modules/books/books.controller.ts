import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";

import { BooksService } from "./books.service";
import { Roles } from "src/common/enums/role.enum";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { CanAccess } from "src/common/decorators/role.decorator";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";

@Controller("books")
@ApiTags("Books")
@AuthDecorator()
export class BooksController {
	constructor(private readonly booksService: BooksService) {}

	@Post()
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.MultipartData)
	create(@Body() createBookDto: CreateBookDto) {
		return this.booksService.create(createBookDto);
	}

	@Get()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findAll() {
		return this.booksService.findAll();
	}

	@Get(":id")
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findOne(@Param("id") id: string) {
		return this.booksService.findOne(+id);
	}

	@Patch(":id")
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.MultipartData)
	update(@Param("id") id: string, @Body() updateBookDto: UpdateBookDto) {
		return this.booksService.update(+id, updateBookDto);
	}

	@Delete(":id")
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	remove(@Param("id") id: string) {
		return this.booksService.remove(+id);
	}
}
