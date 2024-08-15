import {
	Get,
	Post,
	Put,
	Body,
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
import { SkipAuth } from "src/common/decorators/skip-auth.decorator";
import { Pagination } from "src/common/decorators/pagination.decorator";
import { PaginationDto, QueryDto } from "src/common/dtos/pagination.dto";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { UploadedOptionalFiles } from "src/common/decorators/upload-file.decorator";
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
	@SkipAuth()
	@Pagination()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findAll(@Query() paginationDto: PaginationDto, @Query() queryDto: QueryDto) {
		return this.booksService.findAll(paginationDto, queryDto);
	}

	@Get(":id")
	@SkipAuth()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.booksService.findOne(id);
	}

	@Get("/by-slug/:slug")
	@SkipAuth()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findBySlug(@Param("slug") slug: string) {
		return this.booksService.findOneBySlug(slug);
	}

	@Put(":id")
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
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() updateBookDto: UpdateBookDto,
		@UploadedOptionalFiles() files: BookImagesType,
	) {
		return this.booksService.update(id, updateBookDto, files);
	}

	@Delete(":id")
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.booksService.remove(id);
	}
}
