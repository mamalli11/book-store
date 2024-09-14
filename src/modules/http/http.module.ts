import { HttpModule } from "@nestjs/axios";
import { Global, Module } from "@nestjs/common";

import { ZarinpalService } from "./zarinpal.service";
import { KavenegarService } from "./kavenegar.service";

@Global()
@Module({
	imports: [
		HttpModule.register({
			maxRedirects: 5,
			timeout: 5000,
		}),
	],
	providers: [ZarinpalService, KavenegarService],
	exports: [ZarinpalService, KavenegarService],
})
export class HttpApiModule {}
