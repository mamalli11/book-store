import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./modules/app/app.module";
import { SwaggerConfigInit } from "./config/swagger.config";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	app.use(cookieParser(process.env.COOKIE_SECRET));

	app.enableCors({
		origin: ["http://localhost:5173", "http://localhost:5174"],
		credentials: true,
		optionsSuccessStatus: 200,
	});
	SwaggerConfigInit(app);
	app.useStaticAssets("public");
	app.useGlobalPipes(new ValidationPipe());
	const { PORT } = process.env;
	await app.listen(PORT, "0.0.0.0", () => {
		console.log(`http://localhost:${PORT} ✅`);
		console.log(`swagger => http://localhost:${PORT}/swagger ✅`);
	});
}
bootstrap();
