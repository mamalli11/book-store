import {
	Put,
	Get,
	Post,
	Body,
	Query,
	Param,
	Delete,
	Controller,
	UseInterceptors,
	UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";

import { Roles } from "src/common/enums/role.enum";
import { PublisherService } from "./publisher.service";
import { multerStorage } from "src/common/utils/multer.util";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { CreatePublisherDto } from "./dto/create-publisher.dto";
import { UpdatePublisherDto } from "./dto/update-publisher.dto";
import { CanAccess } from "src/common/decorators/role.decorator";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
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
	@UseInterceptors(FileInterceptor("image", { storage: multerStorage("publisher-image") }))
	create(
		@Body() createPublisherDto: CreatePublisherDto,
		@UploadedFile() file: Express.Multer.File,
	) {
		return this.publisherService.create(createPublisherDto, file);
	}

	@Get()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findAll(@Query() paginationDto: PaginationDto) {
		return this.publisherService.findAll(paginationDto);
	}

	@Get(":id")
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findOne(@Param("id") id: string) {
		return this.publisherService.findOne(+id);
	}

	@Put(":id")
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.MultipartData)
	@UseInterceptors(FileInterceptor("image", { storage: multerStorage("publisher-image") }))
	update(
		@Param("id") id: string,
		@Body() updatePublisherDto: UpdatePublisherDto,
		@UploadedOptionalFile() file: Express.Multer.File,
	) {
		return this.publisherService.update(+id, updatePublisherDto, file);
	}

	@Delete(":id")
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	remove(@Param("id") id: string) {
		return this.publisherService.remove(+id);
	}
}
