import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailService {
	constructor(private mailService: MailerService) {}

	async welcomMail(email: string, fullName: string = "کاربر") {
		try {
			await this.mailService.sendMail({
				to: email,
				from: `welcome <${process.env.MAIL_FROM}>`,
				subject: "Welcome",
				template: "welcome.html",
				text: "Welcome to our platform",
				context: {
					fullName,
				},
			});
		} catch (error) {
			console.log(error);
		}
	}
}
