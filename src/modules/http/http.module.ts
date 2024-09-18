import { cwd } from "process";
import { HttpModule } from "@nestjs/axios";
import { Global, Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";

import { MailService } from "./mail.service";
import { ZarinpalService } from "./zarinpal.service";
import { KavenegarService } from "./kavenegar.service";

//load data from .env
import * as dotenv from "dotenv";
dotenv.config();

@Global()
@Module({
	imports: [
		MailerModule.forRoot({
			transport: {
				host: process.env.MAIL_HOST,
				port: process.env.MAIL_PORT,
				secure: false,
				auth: {
					user: process.env.MAIL_USER,
					pass: process.env.MAIL_PASSWORD,
				},
			},
			template: {
				dir: cwd() + "/src/common/templates",
				adapter: new EjsAdapter(),
				options: {
					strict: false,
				},
			},
		}),
		HttpModule.register({
			maxRedirects: 5,
			timeout: 5000,
		}),
	],
	providers: [ZarinpalService, KavenegarService, MailService],
	exports: [ZarinpalService, KavenegarService, MailService],
})
export class HttpApiModule {}
