import { BadRequestException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { isEmail, isMobilePhone } from "class-validator";
import { InjectRepository } from "@nestjs/typeorm";
import { Request, Response } from "express";
import { REQUEST } from "@nestjs/core";
import { Repository } from "typeorm";
import { randomInt } from "crypto";

import { AuthResponse } from "./types/response";
import { TokenService } from "./tokens.service";
import { AuthMethod } from "./enums/method.enum";
import { AuthDto, CheckOtpDto } from "./dto/auth.dto";
import { OtpEntity } from "../user/entities/otp.entity";
import { UserEntity } from "../user/entities/user.entity";
import { CookieKeys } from "src/common/enums/cookie.enum";
import { ProfileEntity } from "../user/entities/profile.entity";
import { CookiesOptionsToken } from "src/common/utils/cookie.util";
import { AuthMessage, BadRequestMessage, PublicMessage } from "src/common/enums/message.enum";

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
		@InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
		@InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
		@Inject(REQUEST) private request: Request,
		private tokenService: TokenService,
	) {}

	async login(authDto: AuthDto) {
		const { method, emailOrPhone } = authDto;
		const validUsername = this.userValidator(method, emailOrPhone);
		let user: UserEntity = await this.checkExistUser(method, validUsername);

		if (!user) {
			user = await this.userRepository.save(
				this.userRepository.create({
					[method]: emailOrPhone,
				}),
			);
		}

		const otp = await this.saveOtp(user.id, method);
		const token = this.tokenService.createOtpToken({ userId: user.id });
		const result = { token, code: otp.code };
		return result;
	}

	userValidator(method: AuthMethod, username: string) {
		switch (method) {
			case AuthMethod.Email:
				if (isEmail(username)) return username;
				throw new BadRequestException("Email format is incorrect");

			case AuthMethod.Phone:
				if (isMobilePhone(username, "fa-IR")) return username;
				throw new BadRequestException("Phone format is incorrect");

			default:
				throw new UnauthorizedException("Email Or Phone is not valid");
		}
	}

	async checkExistUser(method: AuthMethod, username: string) {
		let user: UserEntity;
		const filterData: object = {
			select: ["id", "email", "phone", "otpId", "profileId"],
		};
		if (method === AuthMethod.Phone) {
			user = await this.userRepository.findOne({
				where: { phone: username },
				...filterData,
			});
		} else if (method === AuthMethod.Email) {
			user = await this.userRepository.findOne({
				where: { email: username },
				...filterData,
			});
		} else {
			throw new BadRequestException(BadRequestMessage.InValidLoginData);
		}
		return user;
	}

	async sendResponse(res: Response, result: AuthResponse, message: string) {
		const { refreshToken, accessToken } = result;
		return res
			.cookie(CookieKeys.OTP, accessToken, CookiesOptionsToken())
			.cookie(CookieKeys.RefreshToken, refreshToken, CookiesOptionsToken())
			.json({ message, accessToken, refreshToken });
	}

	async validateAccessToken(token: string) {
		const { userId } = this.tokenService.verifyAccessToken(token);
		const user = await this.userRepository.findOneBy({ id: userId });
		if (!user) throw new UnauthorizedException(AuthMessage.LoginAgain);
		return user;
	}

	async saveOtp(userId: number, method: AuthMethod) {
		const code = randomInt(100000, 999999).toString();
		const expiresIn = new Date(Date.now() + 1000 * 60 * 2);
		let otp = await this.otpRepository.findOneBy({ userId });
		let existOtp = false;
		if (otp) {
			existOtp = true;
			otp.code = code;
			otp.expiresIn = expiresIn;
			otp.method = method;
		} else {
			otp = this.otpRepository.create({ code, expiresIn, userId, method });
		}
		otp = await this.otpRepository.save(otp);
		if (!existOtp) {
			await this.userRepository.update({ id: userId }, { otpId: otp.id });
		}
		return otp;
	}

	async checkOtp(checkOtpDto: CheckOtpDto, res: Response) {
		const { code, token } = checkOtpDto;
		if (!token) throw new UnauthorizedException(AuthMessage.ExpiredCode);
		const { userId } = this.tokenService.verifyOtpToken(token);

		const otp = await this.otpRepository.findOneBy({ userId });
		if (!otp) throw new UnauthorizedException(AuthMessage.LoginAgain);

		const now = new Date();
		if (otp.expiresIn < now) throw new UnauthorizedException(AuthMessage.ExpiredCode);
		if (otp.code !== code) throw new UnauthorizedException(AuthMessage.InvalidCode);
		const { token: accessToken, refreshToken } = this.tokenService.createAccessToken({ userId });

		if (otp.method === AuthMethod.Email) {
			await this.userRepository.update({ id: userId }, { verify_email: true });
		} else if (otp.method === AuthMethod.Phone) {
			await this.userRepository.update({ id: userId }, { verify_phone: true });
		}

		let profile = await this.profileRepository.save(this.profileRepository.create({ userId }));
		await this.userRepository.update({ id: userId }, { profileId: profile.id });
		await this.otpRepository.update({ id: userId }, { refreshToken });

		const result = { accessToken, refreshToken };
		return this.sendResponse(res, result, PublicMessage.LoggedIn);
	}

	async refreshToken(res: Response) {
		if (!this.request.cookies?.[CookieKeys.RefreshToken])
			throw new UnauthorizedException(AuthMessage.LoginAgain);

		let token: any = this.request.cookies?.[CookieKeys.RefreshToken];

		const { userId } = this.tokenService.verifyRefreshToken(token);
		const user = await this.otpRepository.findOneBy({ userId });
		if (!user) throw new UnauthorizedException(AuthMessage.ExpiredToken);

		if (user.refreshToken !== token) throw new UnauthorizedException(AuthMessage.ExpiredToken);

		const { token: accessToken, refreshToken } = this.tokenService.createAccessToken({ userId });

		await this.otpRepository.update({ id: userId }, { refreshToken });

		return this.sendResponse(res, { accessToken, refreshToken }, PublicMessage.LoggedIn);
	}

	async logout(res: Response, req: Request) {
		const { id } = req.user;
		if (!this.request.cookies?.[CookieKeys.OTP])
			throw new UnauthorizedException(AuthMessage.LoginAgain);

		await this.otpRepository.update({ userId: id }, { refreshToken: null });

		return res.clearCookie(CookieKeys.OTP).clearCookie(CookieKeys.RefreshToken).status(200).json({
			message: AuthMessage.LogoutSuccessfully,
		});
	}
}
