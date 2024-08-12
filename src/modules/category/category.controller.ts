import {
	Get,
	Post,
	Body,
	Patch,
	Param,
	Query,
	Delete,
	Controller,
	UseInterceptors,
	ParseIntPipe,
} from "@nestjs/common";
import { ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";

import { Roles } from "src/common/enums/role.enum";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { CanAccess } from "src/common/decorators/role.decorator";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { SkipAuth } from "src/common/decorators/skip-auth.decorator";
import { Pagination } from "src/common/decorators/pagination.decorator";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { UploadFileS3 } from "src/common/interceptors/upload-file.interceptor";
import { UploadedOptionalFile } from "src/common/decorators/upload-file.decorator";

@Controller("category")
@ApiTags("Category")
@AuthDecorator()
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Post()
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.MultipartData)
	@UseInterceptors(UploadFileS3("image"))
	create(
		@Body() createCategoryDto: CreateCategoryDto,
		@UploadedOptionalFile() file: Express.Multer.File,
	) {
		return this.categoryService.create(createCategoryDto, file);
	}

	@Get()
	@SkipAuth()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	@Pagination()
	findAll(@Query() paginationDto: PaginationDto) {
		return this.categoryService.findAll(paginationDto);
	}

	@Get(":id")
	@SkipAuth()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.categoryService.findOneById(id);
	}

	@Get("/by-slug/:slug")
	findBySlug(@Param("slug") slug: string) {
		return this.categoryService.findBySlug(slug);
	}

	@Patch(":id")
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.MultipartData)
	@UseInterceptors(UploadFileS3("image"))
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() updateCategoryDto: UpdateCategoryDto,
		@UploadedOptionalFile() file: Express.Multer.File,
	) {
		return this.categoryService.update(id, updateCategoryDto, file);
	}

	@Delete(":id")
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.categoryService.remove(id);
	}
}
