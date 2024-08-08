import { CookieOptions } from "express";

export function CookiesOptionsToken(): CookieOptions {
	return {
		signed: true,
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
		// sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
		sameSite: "lax",
		// maxAge: 1000 * 60 * 60 * 24 * 2, // 2 DAY
		// domain: process.env.NODE_ENV === "production" ? "bookstoree.liara.run" : undefined,
		// domain: process.env.NODE_ENV === "development" ? "localhost" : "bookstoree.liara.run",
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
	};
}
