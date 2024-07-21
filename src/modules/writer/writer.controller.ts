import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	UseInterceptors,
	UseGuards,
	Query,
	Put,
} from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";

import { WriterService } from "./writer.service";
import { AuthGuard } from "../auth/guards/auth.guard";
import { CreateWriterDto } from "./dto/create-writer.dto";
import { UpdateWriterDto } from "./dto/update-writer.dto";
import { multerStorage } from "src/common/utils/multer.util";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { UploadedOptionalFile } from "src/common/decorators/upload-file.decorator";
import { PaginationDto } from "src/common/dtos/pagination.dto";

@Controller("writer")
@ApiTags("Writer")
@ApiBearerAuth("Authorization")
@UseGuards(AuthGuard)
export class WriterController {
	constructor(private readonly writerService: WriterService) {}

	@Post()
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
	remove(@Param("id") id: string) {
		return this.writerService.remove(+id);
	}
}
