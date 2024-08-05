export function CookiesOptionsToken() {
	return {
		secure: true,
		signed: true,
		httpOnly: true,
		samesite: "lax",
		maxAge: 1000 * 60 * 60 * 24 * 2, // would expire after 2 days
		expires: new Date(Date.now() + 1000 * 60 * 2),
	};
}
