import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	UseInterceptors,
	Query,
	Put,
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
		@UploadedOptionalFile() files: Express.Multer.File,
		@Body() createWriterDto: CreateWriterDto,
	) {
		return this.writerService.create(files, createWriterDto);
	}

	@Get()
	findAll(@Query() paginationDto: PaginationDto) {
		return this.writerService.findAll(paginationDto);
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.writerService.findOne(+id);
	}

	@Put(":id")
	@CanAccess(Roles.Admin)
	@ApiConsumes(SwaggerConsumes.MultipartData)
	@UseInterceptors(FileInterceptor("image", { storage: multerStorage("writer-image") }))
	update(
		@UploadedOptionalFile() files: Express.Multer.File,
		@Param("id") id: string,
		@Body() updateWriterDto: UpdateWriterDto,
	) {
		return this.writerService.update(files, +id, updateWriterDto);
	}

	@Delete(":id")
	@CanAccess(Roles.Admin)
	remove(@Param("id") id: string) {
		return this.writerService.remove(+id);
	}
}
