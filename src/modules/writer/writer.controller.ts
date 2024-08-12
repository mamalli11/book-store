import {
	Get,
	Put,
	Post,
	Body,
	Query,
	Param,
	Delete,
	Controller,
	ParseIntPipe,
	UseInterceptors,
} from "@nestjs/common";
import { ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";

import { WriterService } from "./writer.service";
import { Roles } from "src/common/enums/role.enum";
import { CreateWriterDto } from "./dto/create-writer.dto";
import { UpdateWriterDto } from "./dto/update-writer.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { CanAccess } from "src/common/decorators/role.decorator";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { SkipAuth } from "src/common/decorators/skip-auth.decorator";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { UploadFileS3 } from "src/common/interceptors/upload-file.interceptor";
import { UploadedOptionalFile } from "src/common/decorators/upload-file.decorator";

@Controller("writer")
@ApiTags("Writer")
@AuthDecorator()
export class WriterController {
	constructor(private readonly writerService: WriterService) {}

	@Post()
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.MultipartData)
	@UseInterceptors(UploadFileS3("image"))
	create(
		@Body() createWriterDto: CreateWriterDto,
		@UploadedOptionalFile() file: Express.Multer.File,
	) {
		return this.writerService.create(createWriterDto, file);
	}

	@Get()
	@SkipAuth()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findAll(@Query() paginationDto: PaginationDto) {
		return this.writerService.findAll(paginationDto);
	}

	@Get(":id")
	@SkipAuth()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.writerService.findOne(id);
	}

	@Put(":id")
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.MultipartData)
	@UseInterceptors(UploadFileS3("image"))
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() updateWriterDto: UpdateWriterDto,
		@UploadedOptionalFile() file: Express.Multer.File,
	) {
		return this.writerService.update(id, updateWriterDto, file);
	}

	@Delete(":id")
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.writerService.remove(id);
	}
}
