import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./modules/app/app.module";
import { SwaggerConfigInit } from "./config/swagger.config";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	SwaggerConfigInit(app);
	app.useStaticAssets("public");
	app.useGlobalPipes(new ValidationPipe());
	app.use(cookieParser(process.env.COOKIE_SECRET));
	app.enableCors({
		allowedHeaders: "*",
		origin: "*",
		credentials: true,
	});
	const { PORT } = process.env;
	await app.listen(PORT, "0.0.0.0", () => {
		console.log(`http://localhost:${PORT} ✅`);
		console.log(`swagger => http://localhost:${PORT}/swagger ✅`);
	});
}
bootstrap();
