import { BadRequestException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { isEmail, isMobilePhone } from "class-validator";
import { Request, Response } from "express";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { REQUEST } from "@nestjs/core";

import { AuthDto } from "./dto/auth.dto";
import { AuthMethod } from "./enums/method.enum";
import { UserEntity } from "../user/entities/user.entity";
import { ProfileEntity } from "../user/entities/profile.entity";
import { AuthMessage, BadRequestMessage, PublicMessage } from "src/common/enums/message.enum";
import { CookiesOptionsToken } from "src/common/utils/cookie.util";
import { CookieKeys } from "src/common/enums/cookie.enum";
import { AuthResponse } from "./types/response";
import { randomInt } from "crypto";
import { OtpEntity } from "../user/entities/otp.entity";
import { TokenService } from "./tokens.service";

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
		@InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
		@InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
		@Inject(REQUEST) private request: Request,
		private tokenService: TokenService,
	) {}

	async login(authDto: AuthDto, res: Response) {
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
		return this.sendResponse(res, result);
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
	async sendResponse(res: Response, result: AuthResponse) {
		const { token, code } = result;
		res.cookie(CookieKeys.OTP, token, CookiesOptionsToken());
		return res.json({ message: PublicMessage.SentOtp, code });
	}
	async validateAccessToken(token: string) {
		const { userId } = this.tokenService.verifyAccessToken(token);
		const user = await this.userRepository.findOneBy({ id: userId });
		if (!user) throw new UnauthorizedException(AuthMessage.LoginAgain);
		return user;
	}
	async saveOtp(userId: number, method: AuthMethod) {
		const code = randomInt(10000, 99999).toString();
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
	async checkOtp(code: string) {
		const token = this.request.cookies?.[CookieKeys.OTP];
		if (!token) throw new UnauthorizedException(AuthMessage.ExpiredCode);
		const { userId } = this.tokenService.verifyOtpToken(token);

		const otp = await this.otpRepository.findOneBy({ userId });
		if (!otp) throw new UnauthorizedException(AuthMessage.LoginAgain);

		const now = new Date();
		if (otp.expiresIn < now) throw new UnauthorizedException(AuthMessage.ExpiredCode);
		if (otp.code !== code) throw new UnauthorizedException(AuthMessage.TryAgain);
		const { token: accessToken, refreshToken } = this.tokenService.createAccessToken({ userId });

		if (otp.method === AuthMethod.Email) {
			await this.userRepository.update({ id: userId }, { verify_email: true });
		} else if (otp.method === AuthMethod.Phone) {
			await this.userRepository.update({ id: userId }, { verify_phone: true });
		}

		let profile = await this.profileRepository.save(
			this.profileRepository.create({
				userId,
			}),
		);
		await this.userRepository.update({ id: userId }, { profileId: profile.id });

		return { message: PublicMessage.LoggedIn, accessToken, refreshToken };
	}
}
