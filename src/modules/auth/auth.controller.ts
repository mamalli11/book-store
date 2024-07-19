import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";

import { AuthService } from "./auth.service";
import { AuthGuard } from "./guards/auth.guard";
import { AuthDto, CheckOtpDto } from "./dto/auth.dto";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("login")
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	userExistence(@Body() authDto: AuthDto, @Res() res: Response) {
		return this.authService.login(authDto, res);
	}

	@Post("check-otp")
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	checkOtp(@Body() checkOtpDto: CheckOtpDto) {
		return this.authService.checkOtp(checkOtpDto.code);
	}

	@Get("check-login")
	@ApiBearerAuth("Authorization")
	@UseGuards(AuthGuard)
	checkLogin(@Req() req: Request) {
		return req.user;
	}
}
