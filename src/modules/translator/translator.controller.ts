import {
	Get,
	Put,
	Post,
	Body,
	Param,
	Query,
	Delete,
	Controller,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";

import { Roles } from "src/common/enums/role.enum";
import { TranslatorService } from "./translator.service";
import { multerStorage } from "src/common/utils/multer.util";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { CanAccess } from "src/common/decorators/role.decorator";
import { CreateTranslatorDto } from "./dto/create-translator.dto";
import { UpdateTranslatorDto } from "./dto/update-translator.dto";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { UploadedOptionalFile } from "src/common/decorators/upload-file.decorator";

@Controller("translator")
@ApiTags("Translator")
@AuthDecorator()
export class TranslatorController {
	constructor(private readonly translatorService: TranslatorService) {}

	@Post()
	@CanAccess(Roles.Admin)
	@ApiConsumes(SwaggerConsumes.MultipartData)
	@UseInterceptors(FileInterceptor("image", { storage: multerStorage("translator-image") }))
	create(
		@Body() createTranslatorDto: CreateTranslatorDto,
		@UploadedOptionalFile() file: Express.Multer.File,
	) {
		return this.translatorService.create(createTranslatorDto, file);
	}

	@Get()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findAll(@Query() paginationDto: PaginationDto) {
		return this.translatorService.findAll(paginationDto);
	}

	@Get(":id")
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findOne(@Param("id") id: string) {
		return this.translatorService.findOne(+id);
	}

	@Put(":id")
	@CanAccess(Roles.Admin)
	@ApiConsumes(SwaggerConsumes.MultipartData)
	@UseInterceptors(FileInterceptor("image", { storage: multerStorage("translator-image") }))
	update(
		@Param("id") id: string,
		@Body() updateTranslatorDto: UpdateTranslatorDto,
		@UploadedOptionalFile() file: Express.Multer.File,
	) {
		return this.translatorService.update(+id, updateTranslatorDto, file);
	}

	@Delete(":id")
	@CanAccess(Roles.Admin)
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	remove(@Param("id") id: string) {
		return this.translatorService.remove(+id);
	}
}
