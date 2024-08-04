import {
	Put,
	Get,
	Post,
	Body,
	Query,
	Patch,
	Param,
	Delete,
	Controller,
	ParseIntPipe,
} from "@nestjs/common";
import { ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";

import { Roles } from "src/common/enums/role.enum";
import { CommentsService } from "./comments.service";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { CanAccess } from "src/common/decorators/role.decorator";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { Pagination } from "src/common/decorators/pagination.decorator";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { CreateCommentDto, updateCommentDto } from "./dto/create-comment.dto";

@Controller("comments")
@ApiTags("Book Comments")
@AuthDecorator()
export class CommentsController {
	constructor(private readonly commentsService: CommentsService) {}

	@Post()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	create(@Body() commentDto: CreateCommentDto) {
		return this.commentsService.create(commentDto);
	}

	@Get()
	@Pagination()
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	find(@Query() paginationDto: PaginationDto) {
		return this.commentsService.find(paginationDto);
	}

	@Put("/accept/:id")
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	accept(@Param("id", ParseIntPipe) id: number) {
		return this.commentsService.accept(id);
	}

	@Put("/reject/:id")
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	reject(@Param("id", ParseIntPipe) id: number) {
		return this.commentsService.reject(id);
	}

	@Get("/like/:id")
	likeToggle(@Param("id", ParseIntPipe) id: number) {
		return this.commentsService.likeComment(id);
	}

	@Patch(":id")
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	update(@Param("id", ParseIntPipe) id: number, @Body() updateCommentDto: updateCommentDto) {
		return this.commentsService.update(id, updateCommentDto);
	}

	@Delete(":id")
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.commentsService.remove(id);
	}
}
