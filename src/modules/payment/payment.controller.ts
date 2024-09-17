import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, Post, Query } from "@nestjs/common";

import { PaymentDto } from "./dto/payment.dto";
import { PaymentService } from "./payment.service";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { SkipAuth } from "src/common/decorators/skip-auth.decorator";
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
	@SkipAuth()
	async verifyPayment(@Query("Authority") authority: string, @Query("Status") status: string) {
		return await this.paymentService.verify(authority, status);
	}
}
