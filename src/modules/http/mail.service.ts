import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailService {
	constructor(private mailService: MailerService) {}

	async welcomMail(email: string, fullName: string = "کاربر") {
		setImmediate(async () => {
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
		});
	}

	async verificationMail(email: string, otp_code: string) {
		setImmediate(async () => {
			await this.mailService.sendMail({
				to: email,
				from: `verification <${process.env.MAIL_FROM}>`,
				subject: "Verification Code",
				template: "verification.html",
				text: `
				سلام،
				
				کد تأیید شما برای ورود به سیستم: ${otp_code}

				این کد به مدت ۲ دقیقه معتبر است. لطفاً از آن برای ورود به حساب کاربری خود استفاده کنید.

				اگر شما این درخواست را نساخته‌اید، لطفاً این ایمیل را نادیده بگیرید.
				`,
				context: {
					otp_code,
				},
			});
		});
	}
}
