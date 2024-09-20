import { Request } from "express";
import { isJWT } from "class-validator";
import { Reflector } from "@nestjs/core";
import { I18nService, I18nContext } from "nestjs-i18n";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

import { AuthService } from "../auth.service";
import { SKIP_AUTH } from "src/common/decorators/skip-auth.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private authService: AuthService,
		private readonly i18n: I18nService,
	) {}
	async canActivate(context: ExecutionContext) {
		const isSkippedAuthorization = this.reflector.get<boolean>(SKIP_AUTH, context.getHandler());
		if (isSkippedAuthorization) return true;
		const httpContext = context.switchToHttp();
		const request: Request = httpContext.getRequest<Request>();
		const token = this.extractToken(request);
		request.user = await this.authService.validateAccessToken(token);
		return true;
	}
	protected extractToken(request: Request) {
		const { authorization } = request.headers;
		if (!authorization || authorization?.trim() == "") {
			throw new UnauthorizedException(
				this.i18n.t("tr.AuthMessage.LoginIsRequired", {
					lang: I18nContext.current().lang,
				}),
			);
		}
		const [bearer, token] = authorization?.split(" ");
		if (bearer?.toLowerCase() !== "bearer" || !token || !isJWT(token)) {
			throw new UnauthorizedException(
				this.i18n.t("tr.AuthMessage.LoginIsRequired", {
					lang: I18nContext.current().lang,
				}),
			);
		}
		return token;
	}
}
