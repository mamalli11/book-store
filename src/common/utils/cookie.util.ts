export function CookiesOptionsToken() {
	return {
		secure: true,
		httpOnly: true,
		expires: new Date(Date.now() + 1000 * 60 * 2),
	};
}
