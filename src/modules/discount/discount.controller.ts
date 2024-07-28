import { Controller, Get, Post, Body, Param, Delete, Query } from "@nestjs/common";
import { ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";

import { Roles } from "src/common/enums/role.enum";
import { DiscountService } from "./discount.service";
import { CreateDiscountDto } from "./dto/create-discount.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { CanAccess } from "src/common/decorators/role.decorator";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";

@Controller("discount")
@ApiTags("Discount")
@AuthDecorator()
export class DiscountController {
	constructor(private readonly discountService: DiscountService) {}

	@Post()
	@ApiOperation({ summary: "For the admin role" })
	@CanAccess(Roles.Admin)
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	create(@Body() createDiscountDto: CreateDiscountDto) {
		return this.discountService.create(createDiscountDto);
	}

	@Get()
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findAll(@Query() paginationDto: PaginationDto) {
		return this.discountService.findAll(paginationDto);
	}

	@Get(":id")
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findOne(@Param("id") id: string) {
		return this.discountService.findOne(+id);
	}

	@Delete(":id")
	@CanAccess(Roles.Admin)
	@ApiOperation({ summary: "For the admin role" })
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	remove(@Param("id") id: string) {
		return this.discountService.delete(+id);
	}
}
