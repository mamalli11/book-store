import { Request, Response } from "express";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";

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
	userExistence(@Body() authDto: AuthDto) {
		return this.authService.login(authDto);
	}

	@Post("check-otp")
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	checkOtp(@Body() checkOtpDto: CheckOtpDto, @Res() res: Response) {
		return this.authService.checkOtp(checkOtpDto, res);
	}

	@Get("ref-token")
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	refreshToken(@Res() res: Response) {
		return this.authService.refreshToken(res);
	}

	@Get("check-login")
	@ApiBearerAuth("Authorization")
	@UseGuards(AuthGuard)
	checkLogin(@Req() req: Request) {
		return req.user;
	}

	@Get("logout")
	@ApiBearerAuth("Authorization")
	@UseGuards(AuthGuard)
	logout(@Res() res: Response, @Req() req: Request) {
		return this.authService.logout(res, req);
	}
}
