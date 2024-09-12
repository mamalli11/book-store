import { Response } from "express";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";

import { PaymentDto } from "./dto/payment.dto";
import { PaymentService } from "./payment.service";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";

@Controller("Payment")
@ApiTags("Payment")
@AuthDecorator()
export class PaymentController {
	constructor(private paymentService: PaymentService) {}

	@Post()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	gatewayUrl(@Body() paymentDto: PaymentDto) {
		return this.paymentService.getGatewayUrl(paymentDto);
	}

	@Get("/verify")
	async verifyPayment(
		@Query("Authority") authority: string,
		@Query("Status") status: string,
		@Res() res: Response,
	) {
		const url = await this.paymentService.verify(authority, status);
		return res.redirect(url);
	}
}
