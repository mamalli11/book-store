import {
	Get,
	Put,
	Post,
	Body,
	Param,
	Query,
	Delete,
	Controller,
	ParseIntPipe,
	UseInterceptors,
} from "@nestjs/common";
import { ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";

import { Roles } from "src/common/enums/role.enum";
import { TranslatorService } from "./translator.service";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { CanAccess } from "src/common/decorators/role.decorator";
import { CreateTranslatorDto } from "./dto/create-translator.dto";
import { UpdateTranslatorDto } from "./dto/update-translator.dto";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { SkipAuth } from "src/common/decorators/skip-auth.decorator";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { UploadFileS3 } from "src/common/interceptors/upload-file.interceptor";
import { UploadedOptionalFile } from "src/common/decorators/upload-file.decorator";

@Controller("translator")
@ApiTags("Translator")
@AuthDecorator()
export class TranslatorController {
	constructor(private readonly translatorService: TranslatorService) {}

	@Post()
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.MultipartData)
	@UseInterceptors(UploadFileS3("image"))
	create(
		@Body() createTranslatorDto: CreateTranslatorDto,
		@UploadedOptionalFile() file: Express.Multer.File,
	) {
		return this.translatorService.create(createTranslatorDto, file);
	}

	@Get()
	@SkipAuth()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findAll(@Query() paginationDto: PaginationDto) {
		return this.translatorService.findAll(paginationDto);
	}

	@Get(":id")
	@SkipAuth()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.translatorService.findOne(id);
	}

	@Put(":id")
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.MultipartData)
	@UseInterceptors(UploadFileS3("image"))
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() updateTranslatorDto: UpdateTranslatorDto,
		@UploadedOptionalFile() file: Express.Multer.File,
	) {
		return this.translatorService.update(id, updateTranslatorDto, file);
	}

	@Delete(":id")
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.translatorService.remove(id);
	}
}
