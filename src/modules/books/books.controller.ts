import {
	Get,
	Post,
	Body,
	Patch,
	Param,
	Query,
	Delete,
	Controller,
	ParseIntPipe,
	UploadedFiles,
	UseInterceptors,
} from "@nestjs/common";
import { ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";

import { BooksService } from "./books.service";
import { BookImagesType } from "./types/up_files";
import { Roles } from "src/common/enums/role.enum";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { CanAccess } from "src/common/decorators/role.decorator";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { Pagination } from "src/common/decorators/pagination.decorator";
import { PaginationDto, QueryDto } from "src/common/dtos/pagination.dto";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { UploadFileFieldsS3 } from "src/common/interceptors/upload-file.interceptor";

@Controller("books")
@ApiTags("Books")
@AuthDecorator()
export class BooksController {
	constructor(private readonly booksService: BooksService) {}

	@Post()
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.MultipartData)
	@UseInterceptors(
		UploadFileFieldsS3([
			{ name: "media1", maxCount: 1 },
			{ name: "media2", maxCount: 1 },
			{ name: "media3", maxCount: 1 },
			{ name: "media4", maxCount: 1 },
			{ name: "media5", maxCount: 1 },
		]),
	)
	create(@Body() createBookDto: CreateBookDto, @UploadedFiles() files: BookImagesType) {
		return this.booksService.create(createBookDto, files);
	}

	@Get()
	@Pagination()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findAll(@Query() paginationDto: PaginationDto, @Query() queryDto: QueryDto) {
		return this.booksService.findAll(paginationDto, queryDto);
	}

	@Get(":id")
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.booksService.findOne(id);
	}

	@Patch(":id")
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.MultipartData)
	update(@Param("id", ParseIntPipe) id: number, @Body() updateBookDto: UpdateBookDto) {
		return this.booksService.update(id, updateBookDto);
	}

	@Delete(":id")
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.booksService.remove(id);
	}
}
