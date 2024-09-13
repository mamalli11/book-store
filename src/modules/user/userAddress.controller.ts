import {
	Put,
	Get,
	Post,
	Body,
	Param,
	Query,
	Delete,
	Controller,
	ParseIntPipe,
} from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";

import { UserAddressService } from "./userAddress.service";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { CreateUserAddressDto, UpdateUserAddressDto } from "./dto/userAddress.dto";

@Controller("userAddress")
@ApiTags("UserAddress")
@AuthDecorator()
export class UserAddressController {
	constructor(private readonly userAddressService: UserAddressService) {}

	@Post()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	create(@Body() createUserAddressDto: CreateUserAddressDto) {
		return this.userAddressService.create(createUserAddressDto);
	}

	@Get()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findAll(@Query() paginationDto: PaginationDto) {
		return this.userAddressService.findAll(paginationDto);
	}

	@Get(":id")
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.userAddressService.findOne(id);
	}

	@Put(":id")
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() updateUserAddressDto: UpdateUserAddressDto,
	) {
		return this.userAddressService.update(id, updateUserAddressDto);
	}

	@Delete(":id")
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.userAddressService.remove(id);
	}
}
