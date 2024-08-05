import { CookieOptions } from "express";

export function CookiesOptionsToken(): CookieOptions {
	return {
		signed: true,
		secure: true,
		httpOnly: true,
		sameSite: "lax",
		maxAge: 1000 * 60 * 60 * 2,
		// domain: "bk-store.liara.run",
		// expires: new Date(Date.now() + 1000 * 60 * 2),
	};
}
