import { ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Controller, Get, Post, Body, Param, Delete, Query } from "@nestjs/common";

import { TagsService } from "./tags.service";
import { CreateTagDto } from "./dto/create-tag.dto";
import { Roles } from "src/common/enums/role.enum";
import { CanAccess } from "src/common/decorators/role.decorator";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { SkipAuth } from "src/common/decorators/skip-auth.decorator";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";

@Controller("tags")
@ApiTags("Tags")
@AuthDecorator()
export class TagsController {
	constructor(private readonly tagsService: TagsService) {}

	@Post()
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	create(@Body() createTagDto: CreateTagDto) {
		return this.tagsService.create(createTagDto);
	}

	@Get()
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findAll(@Query("name") name: string) {
		return this.tagsService.findAll(name);
	}

	@Get("usedThisTag/:id")
	@SkipAuth()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	usedThisTag(@Param("id") id: string) {
		return this.tagsService.usedThisTag(+id);
	}

	@Delete(":id")
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	remove(@Param("id") id: string) {
		return this.tagsService.remove(+id);
	}
}
