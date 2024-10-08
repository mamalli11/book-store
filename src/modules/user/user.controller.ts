import {
	Get,
	Res,
	Put,
	Body,
	Post,
	Patch,
	Param,
	Delete,
	Controller,
	ParseIntPipe,
	UseInterceptors,
} from "@nestjs/common";
import { Response } from "express";
import { I18n, I18nContext } from "nestjs-i18n";
import { ApiConsumes, ApiParam, ApiTags } from "@nestjs/swagger";

import { UserService } from "./user.service";
import { CheckOtpDto } from "../auth/dto/auth.dto";
import { CookieKeys } from "src/common/enums/cookie.enum";
import { CookiesOptionsToken } from "src/common/utils/cookie.util";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { UploadFileS3 } from "src/common/interceptors/upload-file.interceptor";
import { UpdateUserDto, ChangeEmailDto, ChangePhoneDto } from "./dto/profile.dto";
import { UploadedOptionalFile } from "src/common/decorators/upload-file.decorator";

@Controller("user")
@ApiTags("User")
@AuthDecorator()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get("/profile")
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	profile() {
		return this.userService.profile();
	}

	@Put("/profile")
	@ApiConsumes(SwaggerConsumes.MultipartData)
	@UseInterceptors(UploadFileS3("profile_picture"))
	updateInfo(
		@Body() updateUserDto: UpdateUserDto,
		@UploadedOptionalFile() files: Express.Multer.File,
	) {
		return this.userService.updateInfo(updateUserDto, files);
	}

	@Delete()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	removeAccount() {
		return this.userService.removeAccount();
	}

	@Patch("/change-email")
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	async changeEmail(
		@Res() res: Response,
		@I18n() i18n: I18nContext,
		@Body() emailDto: ChangeEmailDto,
	) {
		const { code, token, message } = await this.userService.changeEmail(emailDto.email);
		if (message) return res.json({ message });

		res.cookie(CookieKeys.EmailOTP, token, CookiesOptionsToken());
		res.json({ message: i18n.t("PublicMessage.SentOtp"), code, token });
	}

	@Post("/verify-email-otp")
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	async verifyEmail(@Body() otpDto: CheckOtpDto) {
		return this.userService.verifyEmail(otpDto.code);
	}

	@Patch("/change-phone")
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	async changePhone(
		@Res() res: Response,
		@I18n() i18n: I18nContext,
		@Body() phoneDto: ChangePhoneDto,
	) {
		const { code, token, message } = await this.userService.changePhone(phoneDto.phone);
		if (message) return res.json({ message });

		res.cookie(CookieKeys.PhoneOTP, token, CookiesOptionsToken());
		res.json({ message: i18n.t("PublicMessage.SentOtp"), code, token });
	}

	@Post("/verify-phone-otp")
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	async verifyPhone(@Body() otpDto: CheckOtpDto) {
		return this.userService.verifyPhone(otpDto.code);
	}

	@Get("/userProfile/:userId")
	@ApiParam({ name: "userId" })
	userProfile(@Param("userId", ParseIntPipe) userId: number) {
		return this.userService.userProfile(userId);
	}
}
