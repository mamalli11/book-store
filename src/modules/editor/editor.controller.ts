import {
	Put,
	Get,
	Post,
	Body,
	Param,
	Query,
	Delete,
	Controller,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";

import { EditorService } from "./editor.service";
import { Roles } from "src/common/enums/role.enum";
import { CreateEditorDto } from "./dto/create-editor.dto";
import { UpdateEditorDto } from "./dto/update-editor.dto";
import { multerStorage } from "src/common/utils/multer.util";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { CanAccess } from "src/common/decorators/role.decorator";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
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
	@UseInterceptors(FileInterceptor("image", { storage: multerStorage("editor-image") }))
	create(
		@Body() createEditorDto: CreateEditorDto,
		@UploadedOptionalFile() file: Express.Multer.File,
	) {
		return this.editorService.create(createEditorDto, file);
	}

	@Get()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findAll(@Query() paginationDto: PaginationDto) {
		return this.editorService.findAll(paginationDto);
	}

	@Get(":id")
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findOne(@Param("id") id: string) {
		return this.editorService.findOne(+id);
	}

	@Put(":id")
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.MultipartData)
	@UseInterceptors(FileInterceptor("image", { storage: multerStorage("editor-image") }))
	update(
		@Param("id") id: string,
		@Body() updateEditorDto: UpdateEditorDto,
		@UploadedOptionalFile() file: Express.Multer.File,
	) {
		return this.editorService.update(+id, updateEditorDto, file);
	}

	@Delete(":id")
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	remove(@Param("id") id: string) {
		return this.editorService.remove(+id);
	}
}
