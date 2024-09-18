namespace NodeJS {
	interface ProcessEnv {
		//Application
		URL: string;
		PORT: number;
		NODE_ENV: string;
		//Database
		DB_HOST: string;
		DB_PORT: number;
		DB_NAME: string;
		DB_USERNAME: string;
		DB_PASSWORD: string;
		//secrets
		COOKIE_SECRET: string;
		OTP_TOKEN_SECRET: string;
		EMAIL_TOKEN_SECRET: string;
		PHONE_TOKEN_SECRET: string;
		ACCESS_TOKEN_SECRET: string;
		REFRESH_TOKEN_SECRET: string;
		//s3
		S3_ENDPOINT: string;
		S3_ACCESS_KEY: string;
		S3_SECRET_KEY: string;
		S3_BUCKET_NAME: string;
		//Zarinnpal
		ZARINPAL_VERIFY_URL: string;
		ZARINPAL_REQUEST_URL: string;
		ZARINPAL_GATEWAY_URL: string;
		ZARINPAL_MERCHANT_ID: string;
		//Nodemailer
		MAIL_FROM: string;
		MAIL_HOST: string;
		MAIL_PORT: number;
		MAIL_USER: string;
		MAIL_PASSWORD: string;
		//SMS.ir
		SMS_IR_API_KEY: string;
		//Kavenegar
		KAVENEGAR_API_KEY: string;
	}
}
