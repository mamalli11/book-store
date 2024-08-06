import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./modules/app/app.module";
import { SwaggerConfigInit } from "./config/swagger.config";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	const { PORT, NODE_ENV, COOKIE_SECRET, URL } = process.env;

	app.enableCors({
		origin: ["http://localhost:5173", "http://localhost:5174", "https://bookstoree.liara.run"],
		credentials: true,
		optionsSuccessStatus: 200,
	});

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
