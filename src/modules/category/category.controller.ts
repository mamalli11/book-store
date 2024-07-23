import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseInterceptors,
	Query,
} from "@nestjs/common";

import { Roles } from "src/common/enums/role.enum";
import { CategoryService } from "./category.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerStorage } from "src/common/utils/multer.util";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CanAccess } from "src/common/decorators/role.decorator";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { UploadedOptionalFile } from "src/common/decorators/upload-file.decorator";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { Pagination } from "src/common/decorators/pagination.decorator";

@Controller("category")
@ApiTags("Category")
@AuthDecorator()
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Post()
	@CanAccess(Roles.Admin)
	@ApiConsumes(SwaggerConsumes.MultipartData)
	@UseInterceptors(FileInterceptor("image", { storage: multerStorage("cate-image") }))
	create(
		@UploadedOptionalFile() file: Express.Multer.File,
		@Body() createCategoryDto: CreateCategoryDto,
	) {
		return this.categoryService.create(file, createCategoryDto);
	}

	@Get()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	@Pagination()
	findAll(@Query() paginationDto: PaginationDto) {
		return this.categoryService.findAll(paginationDto);
	}

	@Get(":id")
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findOne(@Param("id") id: string) {
		return this.categoryService.findOne(+id);
	}

	@Patch(":id")
	@CanAccess(Roles.Admin)
	@ApiConsumes(SwaggerConsumes.MultipartData)
	@UseInterceptors(FileInterceptor("image", { storage: multerStorage("cate-image") }))
	update(
		@UploadedOptionalFile() file: Express.Multer.File,
		@Param("id") id: string,
		@Body() updateCategoryDto: UpdateCategoryDto,
	) {
		return this.categoryService.update(+id, updateCategoryDto, file);
	}

	@Delete(":id")
	@CanAccess(Roles.Admin)
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	remove(@Param("id") id: string) {
		return this.categoryService.remove(+id);
	}
}
