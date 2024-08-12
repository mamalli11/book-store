import {
	Put,
	Get,
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

import { EditorService } from "./editor.service";
import { Roles } from "src/common/enums/role.enum";
import { CreateEditorDto } from "./dto/create-editor.dto";
import { UpdateEditorDto } from "./dto/update-editor.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { CanAccess } from "src/common/decorators/role.decorator";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { SkipAuth } from "src/common/decorators/skip-auth.decorator";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { UploadFileS3 } from "src/common/interceptors/upload-file.interceptor";
import { UploadedOptionalFile } from "src/common/decorators/upload-file.decorator";

@Controller("editor")
@ApiTags("Editor")
@AuthDecorator()
export class EditorController {
	constructor(private readonly editorService: EditorService) {}

	@Post()
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.MultipartData)
	@UseInterceptors(UploadFileS3("image"))
	create(
		@Body() createEditorDto: CreateEditorDto,
		@UploadedOptionalFile() file: Express.Multer.File,
	) {
		return this.editorService.create(createEditorDto, file);
	}

	@Get()
	@SkipAuth()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findAll(@Query() paginationDto: PaginationDto) {
		return this.editorService.findAll(paginationDto);
	}

	@Get(":id")
	@SkipAuth()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.editorService.findOne(id);
	}

	@Put(":id")
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.MultipartData)
	@UseInterceptors(UploadFileS3("image"))
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() updateEditorDto: UpdateEditorDto,
		@UploadedOptionalFile() file: Express.Multer.File,
	) {
		return this.editorService.update(id, updateEditorDto, file);
	}

	@Delete(":id")
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.editorService.remove(id);
	}
}
