import { CookieOptions } from "express";

export function CookiesOptionsToken(): CookieOptions {
	return {
		signed: true,
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
		sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
		maxAge: 1000 * 60 * 60 * 24 * 2, // 2 DAY
		domain: process.env.NODE_ENV === "production" ? "bookstoree.liara.run" : undefined,
		// expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
	};
}
