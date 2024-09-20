import { JwtService } from "@nestjs/jwt";
import { I18nService, I18nContext } from "nestjs-i18n";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";

import {
	CookiePayload,
	EmailTokenPayload,
	PhoneTokenPayload,
	AccessTokenPayload,
} from "./types/payload";

@Injectable()
export class TokenService {
	constructor(
		private readonly i18n: I18nService,
		private jwtService: JwtService,
	) {}

	createOtpToken(payload: CookiePayload) {
		const token = this.jwtService.sign(payload, {
			secret: process.env.OTP_TOKEN_SECRET,
			expiresIn: 60 * 2,
		});
		return token;
	}
	verifyOtpToken(token: string): CookiePayload {
		try {
			return this.jwtService.verify(token, { secret: process.env.OTP_TOKEN_SECRET });
		} catch (error) {
			throw new UnauthorizedException(
				this.i18n.t("tr.AuthMessage.TryAgain", {
					lang: I18nContext.current().lang,
				}),
			);
		}
	}
	createAccessToken(payload: AccessTokenPayload) {
		const token = this.jwtService.sign(payload, {
			secret: process.env.ACCESS_TOKEN_SECRET,
			expiresIn: "1w",
		});
		const refreshToken = this.jwtService.sign(payload, {
			secret: process.env.REFRESH_TOKEN_SECRET,
			expiresIn: "30d",
		});
		return { token, refreshToken };
	}
	verifyAccessToken(token: string): AccessTokenPayload {
		try {
			return this.jwtService.verify(token, { secret: process.env.ACCESS_TOKEN_SECRET });
		} catch (error) {
			throw new UnauthorizedException(
				this.i18n.t("tr.AuthMessage.LoginAgain", {
					lang: I18nContext.current().lang,
				}),
			);
		}
	}
	verifyRefreshToken(token: string): AccessTokenPayload {
		try {
			return this.jwtService.verify(token, { secret: process.env.REFRESH_TOKEN_SECRET });
		} catch (error) {
			throw new UnauthorizedException(
				this.i18n.t("tr.AuthMessage.ExpiredToken", {
					lang: I18nContext.current().lang,
				}),
			);
		}
	}
	createEmailToken(payload: EmailTokenPayload) {
		const token = this.jwtService.sign(payload, {
			secret: process.env.EMAIL_TOKEN_SECRET,
			expiresIn: 60 * 2,
		});
		return token;
	}
	verifyEmailToken(token: string): EmailTokenPayload {
		try {
			return this.jwtService.verify(token, { secret: process.env.EMAIL_TOKEN_SECRET });
		} catch (error) {
			throw new BadRequestException(
				this.i18n.t("tr.BadRequestMessage.SomeThingWrong", {
					lang: I18nContext.current().lang,
				}),
			);
		}
	}
	createPhoneToken(payload: PhoneTokenPayload) {
		const token = this.jwtService.sign(payload, {
			secret: process.env.PHONE_TOKEN_SECRET,
			expiresIn: 60 * 2,
		});
		return token;
	}
	verifyPhoneToken(token: string): PhoneTokenPayload {
		try {
			return this.jwtService.verify(token, { secret: process.env.PHONE_TOKEN_SECRET });
		} catch (error) {
			throw new BadRequestException(
				this.i18n.t("tr.BadRequestMessage.SomeThingWrong", {
					lang: I18nContext.current().lang,
				}),
			);
		}
	}
}
