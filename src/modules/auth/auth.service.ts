import { BadRequestException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { isEmail, isMobilePhone } from "class-validator";
import { I18nService, I18nContext } from "nestjs-i18n";
import { Repository, EntityManager } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Request, Response } from "express";
import { REQUEST } from "@nestjs/core";
import { randomInt } from "crypto";

import { AuthResponse } from "./types/response";
import { TokenService } from "./tokens.service";
import { AuthMethod } from "./enums/method.enum";
import { MailService } from "../http/mail.service";
import { AuthDto, CheckOtpDto } from "./dto/auth.dto";
import { Sms_irService } from "../http/sms_ir.service";
import { OtpEntity } from "../user/entities/otp.entity";
import { UserEntity } from "../user/entities/user.entity";
import { CookieKeys } from "src/common/enums/cookie.enum";
import { ProfileEntity } from "../user/entities/profile.entity";
import { CookiesOptionsToken } from "src/common/utils/cookie.util";

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
		@InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
		@InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
		@Inject(REQUEST) private request: Request,
		private mailService: MailService,
		private readonly i18n: I18nService,
		private tokenService: TokenService,
		private smsIrService: Sms_irService,
	) {}

	async login(authDto: AuthDto) {
		const { method, emailOrPhone } = authDto;
		const validUsername = this.userValidator(method, emailOrPhone);

		let user = await this.checkExistUser(method, validUsername);
		if (!user) {
			user = await this.userRepository.save(
				this.userRepository.create({ [method]: emailOrPhone }),
			);
		}

		const otp = await this.saveOtp(user.id, method);
		const token = this.tokenService.createOtpToken({ userId: user.id });

		if (process.env.NODE_ENV === "production") {
			if (method === AuthMethod.Email) {
				await this.mailService.verificationMail(user.email, otp.code);
			}
			if (method === AuthMethod.Phone) {
				await this.smsIrService.sendVerificationCode(emailOrPhone, [
					{ name: "Code", value: otp.code },
				]);
			}
		}
		return { token, code: otp.code };
	}

	userValidator(method: AuthMethod, username: string) {
		if (method === AuthMethod.Email && isEmail(username)) return username;
		if (method === AuthMethod.Phone && isMobilePhone(username, "fa-IR")) return username;
		throw new BadRequestException(
			this.i18n.t("tr.ValidationMessage.InvalidEmailOrPhone", {
				lang: I18nContext.current().lang,
			}),
		);
	}

	async checkExistUser(method: AuthMethod, username: string) {
		const whereCondition =
			method === AuthMethod.Phone ? { phone: username } : { email: username };
		return await this.userRepository.findOne({
			where: whereCondition,
			select: ["id", "email", "phone", "otpId", "profileId"],
		});
	}

	async sendResponse(res: Response, result: AuthResponse, message: string) {
		const { refreshToken, accessToken } = result;
		return res
			.cookie(CookieKeys.AccessToken, accessToken, CookiesOptionsToken())
			.cookie(CookieKeys.RefreshToken, refreshToken, CookiesOptionsToken())
			.json({ message, accessToken, refreshToken });
	}

	async validateAccessToken(token: string) {
		const { userId } = this.tokenService.verifyAccessToken(token);
		const user = await this.userRepository.findOneBy({ id: userId });
		if (!user)
			throw new UnauthorizedException(
				this.i18n.t("tr.AuthMessage.LoginAgain", {
					lang: I18nContext.current().lang,
				}),
			);
		return user;
	}

	async saveOtp(userId: number, method: AuthMethod) {
		const code = randomInt(100000, 999999).toString();
		const expiresIn = new Date(Date.now() + 1000 * 60 * 2);

		let otp = await this.otpRepository.findOneBy({ userId });
		if (otp) {
			Object.assign(otp, { code, expiresIn, method });
		} else {
			otp = this.otpRepository.create({ code, expiresIn, userId, method });
			await this.userRepository.update({ id: userId }, { otpId: otp.id });
		}

		return await this.otpRepository.save(otp);
	}

	async checkOtp(checkOtpDto: CheckOtpDto, res: Response) {
		const { code, token } = checkOtpDto;

		if (!token)
			throw new UnauthorizedException(
				this.i18n.t("tr.AuthMessage.ExpiredCode", {
					lang: I18nContext.current().lang,
				}),
			);
		const { userId } = this.tokenService.verifyOtpToken(token);

		return await this.userRepository.manager.transaction(async (manager: EntityManager) => {
			const otp = await manager.findOne(OtpEntity, { where: { userId } });
			if (!otp || otp.expiresIn < new Date() || otp.code !== code) {
				throw new UnauthorizedException(
					this.i18n.t("tr.AuthMessage.InvalidCode", {
						lang: I18nContext.current().lang,
					}),
				);
			}

			const { token: accessToken, refreshToken } = this.tokenService.createAccessToken({
				userId,
			});
			const user = await manager.findOne(UserEntity, {
				where: { id: userId },
				relations: ["profile"],
			});

			let profile = user?.profile;
			if (!profile) {
				profile = this.profileRepository.create({ userId });
				await manager.save(ProfileEntity, profile);
				await manager.update(UserEntity, userId, { profileId: profile.id });
			}

			const updateUser: Partial<UserEntity> = {};
			if (otp.method === AuthMethod.Email) {
				if (!user?.welcome_email) {
					await this.mailService.welcomMail(
						user?.email,
						`${profile?.fname} ${profile?.lname}`,
					);
					updateUser.welcome_email = true;
				}
				updateUser.verify_email = true;
			} else if (otp.method === AuthMethod.Phone) {
				updateUser.verify_phone = true;
			}

			await Promise.all([
				manager.update(UserEntity, userId, updateUser),
				manager.update(OtpEntity, otp.id, { refreshToken }),
			]);

			return this.sendResponse(
				res,
				{ accessToken, refreshToken },
				this.i18n.t("tr.PublicMessage.LoggedIn", {
					lang: I18nContext.current().lang,
				}),
			);
		});
	}

	async refreshToken(res: Response) {
		const token = this.request.cookies?.[CookieKeys.RefreshToken];
		if (!token)
			throw new UnauthorizedException(
				this.i18n.t("tr.AuthMessage.LoginAgain", {
					lang: I18nContext.current().lang,
				}),
			);

		const { userId } = this.tokenService.verifyRefreshToken(token);
		const user = await this.otpRepository.findOneBy({ userId });
		if (!user || user.refreshToken !== token)
			throw new UnauthorizedException(
				this.i18n.t("tr.AuthMessage.ExpiredToken", {
					lang: I18nContext.current().lang,
				}),
			);

		const { token: accessToken, refreshToken } = this.tokenService.createAccessToken({ userId });
		await this.otpRepository.update({ id: userId }, { refreshToken });

		return this.sendResponse(
			res,
			{ accessToken, refreshToken },
			this.i18n.t("tr.PublicMessage.LoggedIn", {
				lang: I18nContext.current().lang,
			}),
		);
	}

	async logout(res: Response, req: Request) {
		const { id } = req.user;
		if (!this.request.cookies?.[CookieKeys.AccessToken])
			throw new UnauthorizedException(
				this.i18n.t("tr.AuthMessage.LoginAgain", {
					lang: I18nContext.current().lang,
				}),
			);

		await this.otpRepository.update({ userId: id }, { refreshToken: null });

		return res
			.clearCookie(CookieKeys.AccessToken)
			.clearCookie(CookieKeys.RefreshToken)
			.status(200)
			.json({
				message: this.i18n.t("tr.AuthMessage.LogoutSuccessfully", {
					lang: I18nContext.current().lang,
				}),
			});
	}
}
