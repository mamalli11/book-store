import {
	Get,
	Put,
	Post,
	Body,
	Query,
	Param,
	Delete,
	Controller,
	UseInterceptors,
} from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";

import { WriterService } from "./writer.service";
import { Roles } from "src/common/enums/role.enum";
import { CreateWriterDto } from "./dto/create-writer.dto";
import { UpdateWriterDto } from "./dto/update-writer.dto";
import { multerStorage } from "src/common/utils/multer.util";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { CanAccess } from "src/common/decorators/role.decorator";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { UploadedOptionalFile } from "src/common/decorators/upload-file.decorator";

@Controller("writer")
@ApiTags("Writer")
@AuthDecorator()
export class WriterController {
	constructor(private readonly writerService: WriterService) {}

	@Post()
	@CanAccess(Roles.Admin)
	@ApiConsumes(SwaggerConsumes.MultipartData)
	@UseInterceptors(FileInterceptor("image", { storage: multerStorage("writer-image") }))
	create(
		@Body() createWriterDto: CreateWriterDto,
		@UploadedOptionalFile() file: Express.Multer.File,
	) {
		return this.writerService.create(createWriterDto, file);
	}

	@Get()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findAll(@Query() paginationDto: PaginationDto) {
		return this.writerService.findAll(paginationDto);
	}

	@Get(":id")
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findOne(@Param("id") id: string) {
		return this.writerService.findOne(+id);
	}

	@Put(":id")
	@CanAccess(Roles.Admin)
	@ApiConsumes(SwaggerConsumes.MultipartData)
	@UseInterceptors(FileInterceptor("image", { storage: multerStorage("writer-image") }))
	update(
		@Param("id") id: string,
		@Body() updateWriterDto: UpdateWriterDto,
		@UploadedOptionalFile() file: Express.Multer.File,
	) {
		return this.writerService.update(+id, updateWriterDto, file);
	}

	@Delete(":id")
	@CanAccess(Roles.Admin)
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	remove(@Param("id") id: string) {
		return this.writerService.remove(+id);
	}
}
