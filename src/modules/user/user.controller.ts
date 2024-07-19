import {
	Get,
	Res,
	Put,
	Body,
	Post,
	Patch,
	Param,
	Delete,
	UseGuards,
	Controller,
	UseInterceptors,
} from "@nestjs/common";
import { Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiTags } from "@nestjs/swagger";

import { UpdateUserDto, ChangeEmailDto, ChangePhoneDto } from "./dto/profile.dto";
import { UserService } from "./user.service";
import { CheckOtpDto } from "../auth/dto/auth.dto";
import { AuthGuard } from "../auth/guards/auth.guard";
import { CookieKeys } from "src/common/enums/cookie.enum";
import { multerStorage } from "src/common/utils/multer.util";
import { PublicMessage } from "src/common/enums/message.enum";
import { CookiesOptionsToken } from "src/common/utils/cookie.util";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { UploadedOptionalFile } from "src/common/decorators/upload-file.decorator";

@Controller("user")
@ApiTags("User")
@ApiBearerAuth("Authorization")
@UseGuards(AuthGuard)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get("/profile")
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	profile() {
		return this.userService.profile();
	}

	@Put("/profile")
	@ApiConsumes(SwaggerConsumes.MultipartData)
	@UseInterceptors(FileInterceptor("profile_picture", { storage: multerStorage("user-profile") }))
	updateInfo(
		@UploadedOptionalFile() files: Express.Multer.File,
		@Body() updateUserDto: UpdateUserDto,
	) {
		return this.userService.updateInfo(files, updateUserDto);
	}

	@Delete()
	removeAccount() {
		return this.userService.removeAccount();
	}

	@Patch("/change-email")
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	async changeEmail(@Body() emailDto: ChangeEmailDto, @Res() res: Response) {
		const { code, token, message } = await this.userService.changeEmail(emailDto.email);
		if (message) return res.json({ message });

		res.cookie(CookieKeys.EmailOTP, token, CookiesOptionsToken());
		res.json({ message: PublicMessage.SentOtp, code });
	}

	@Post("/verify-email-otp")
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	async verifyEmail(@Body() otpDto: CheckOtpDto) {
		return this.userService.verifyEmail(otpDto.code);
	}

	@Patch("/change-phone")
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	async changePhone(@Body() phoneDto: ChangePhoneDto, @Res() res: Response) {
		const { code, token, message } = await this.userService.changePhone(phoneDto.phone);
		if (message) return res.json({ message });

		res.cookie(CookieKeys.PhoneOTP, token, CookiesOptionsToken());
		res.json({ message: PublicMessage.SentOtp, code });
	}

	@Post("/verify-phone-otp")
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	async verifyPhone(@Body() otpDto: CheckOtpDto) {
		return this.userService.verifyPhone(otpDto.code);
	}

	@Get("/userProfile/:userId")
	@ApiParam({ name: "userId" })
	userProfile(@Param("userId") userId: number) {
		return this.userService.userProfile(userId);
	}
}
