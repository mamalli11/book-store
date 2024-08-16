import helmet from "helmet";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./modules/app/app.module";
import { SwaggerConfigInit } from "./config/swagger.config";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
	const { PORT, NODE_ENV, COOKIE_SECRET, URL } = process.env;

	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.enableCors({
		credentials: true, // برای ارسال کوکی‌ها
		origin: "https://fbk-store.liara.run", // مطمئن شوید که دامنه‌های مورد نظر به درستی تنظیم شده‌اند
		optionsSuccessStatus: 200,
	});

	// تنظیمات helmet برای امنیت
	app.use(
		helmet({
			contentSecurityPolicy: {
				directives: {
					defaultSrc: ["'self'"],
					styleSrc: ["'self'", "https:", "'unsafe-inline'"],
					scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
					imgSrc: ["'self'", "data:", "https:"],
					connectSrc: ["'self'", "https:", "wss:"],
				},
			},
			frameguard: {
				action: "sameorigin", // اگر نیاز به فریم‌ها دارید، می‌توانید از 'sameorigin' استفاده کنید
			},
			referrerPolicy: { policy: "strict-origin-when-cross-origin" }, // سیاست ارجاع برای امنیت بیشتر
			hsts: {
				maxAge: 60 * 60 * 24 * 365, // 1 سال
				includeSubDomains: true,
				preload: true,
			},
			hidePoweredBy: true,
			xssFilter: true,
			noSniff: true,
			ieNoOpen: true,
			dnsPrefetchControl: { allow: false },
			permittedCrossDomainPolicies: { permittedPolicies: "none" },
		}),
	);

	SwaggerConfigInit(app);
	app.useStaticAssets("public");
	app.use(cookieParser(COOKIE_SECRET));
	app.useGlobalPipes(new ValidationPipe());

	await app.listen(PORT, "0.0.0.0", () => {
		console.log(`Mode: ${NODE_ENV} | Runing : ${URL}:${PORT} ✅`);
		console.log(`swagger => ${URL}:${PORT}/swagger ✅`);
	});
}
bootstrap();
