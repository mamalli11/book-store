import { firstValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";

@Injectable()
export class Sms_irService {
	constructor(private readonly httpService: HttpService) {}

	async sendVerificationCode(
		mobile: string,
		parameters: { name: string; value: string }[],
		templateId: number = 100000,
	): Promise<any> {
		const data = { mobile: mobile, templateId: templateId, parameters: parameters };

		const config = {
			headers: {
				Accept: "text/plain",
				"Content-Type": "application/json",
				"x-api-key": process.env.SMSIR_API_KEY,
			},
		};
		setImmediate(async () => {
			try {
				const response = await firstValueFrom(
					this.httpService.post("https://api.sms.ir/v1/send/verify", data, config),
				);
				return response.data;
			} catch (error) {
				console.error(error);
				throw new Error("Error sending SMS verification");
			}
		});
	}
}
