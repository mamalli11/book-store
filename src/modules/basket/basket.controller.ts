import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";

import { BasketService } from "./basket.service";
import { BasketDto, DiscountBasketDto } from "./dto/basket.dto";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";

@Controller("basket")
@ApiTags("Basket")
@AuthDecorator()
export class BasketController {
	constructor(private readonly basketService: BasketService) {}

	@Get()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	getBasket() {
		return this.basketService.getBasket();
	}

	@Post()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	addToBasket(@Body() basketDto: BasketDto) {
		return this.basketService.addToBasket(basketDto);
	}

	@Post("/discount")
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	addDiscountToBasket(@Body() discountDto: DiscountBasketDto) {
		return this.basketService.addDiscount(discountDto);
	}

	@Delete()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	removeFromBasket(@Body() basketDto: BasketDto) {
		return this.basketService.removeFromBasket(basketDto);
	}

	@Delete("/discount")
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	removeDiscountFromBasket(@Body() discountDto: DiscountBasketDto) {
		return this.basketService.removeDiscount(discountDto);
	}
}
