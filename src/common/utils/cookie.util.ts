import { CookieOptions } from "express";

export function CookiesOptionsToken(): CookieOptions {
	return {
		signed: true,
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
		sameSite: "lax",
		maxAge: 1000 * 60 * 60 * 2,
		domain: process.env.NODE_ENV === "development" ? "localhost" : undefined,
		// expires: new Date(Date.now() + 1000 * 60 * 2),
	};
}
