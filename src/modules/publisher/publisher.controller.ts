import {
	Put,
	Get,
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

import { Roles } from "src/common/enums/role.enum";
import { PublisherService } from "./publisher.service";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { CreatePublisherDto } from "./dto/create-publisher.dto";
import { UpdatePublisherDto } from "./dto/update-publisher.dto";
import { CanAccess } from "src/common/decorators/role.decorator";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { SkipAuth } from "src/common/decorators/skip-auth.decorator";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { UploadFileS3 } from "src/common/interceptors/upload-file.interceptor";
import { Uploaded_File, UploadedOptionalFile } from "src/common/decorators/upload-file.decorator";

@Controller("publisher")
@ApiTags("Publisher")
@AuthDecorator()
export class PublisherController {
	constructor(private readonly publisherService: PublisherService) {}

	@Post()
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.MultipartData)
	@UseInterceptors(UploadFileS3("logo"))
	create(
		@Body() createPublisherDto: CreatePublisherDto,
		@Uploaded_File() file: Express.Multer.File,
	) {
		return this.publisherService.create(createPublisherDto, file);
	}

	@Get()
	@SkipAuth()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findAll(@Query() paginationDto: PaginationDto) {
		return this.publisherService.findAll(paginationDto);
	}

	@Get(":id")
	@SkipAuth()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.publisherService.findOne(id);
	}

	@Put(":id")
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.MultipartData)
	@UseInterceptors(UploadFileS3("logo"))
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() updatePublisherDto: UpdatePublisherDto,
		@UploadedOptionalFile() file: Express.Multer.File,
	) {
		return this.publisherService.update(id, updatePublisherDto, file);
	}

	@Delete(":id")
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.publisherService.remove(id);
	}
}
