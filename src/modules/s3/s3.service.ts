import { extname } from "path";
import { randomInt } from "crypto";
import { Injectable } from "@nestjs/common";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

@Injectable()
export class S3Service {
	private readonly s3: S3Client;

	constructor() {
		this.s3 = new S3Client({
			credentials: {
				accessKeyId: process.env.S3_ACCESS_KEY,
				secretAccessKey: process.env.S3_SECRET_KEY,
			},
			endpoint: process.env.S3_ENDPOINT,
			region: "default",
		});
	}

	async uploadFile(file: Express.Multer.File, folderName: string) {
		const ext = extname(file.originalname);
		const Key = `${folderName}/${randomInt(1000000, 9999999)}${Date.now()}${ext}`;

		const uploadParams = {
			Bucket: process.env.S3_BUCKET_NAME,
			Key: Key,
			Body: file.buffer,
		};

		try {
			const command = new PutObjectCommand(uploadParams);
			const result = await this.s3.send(command);

			// محاسبه URL فایل آپلود شده
			const Location = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET_NAME}/${Key}`;

			return {
				Location, // URL فایل آپلود شده
				Key, // کلید فایل
			};
		} catch (error) {
			console.error("Error uploading file:", error);
			throw error;
		}
	}

	async deleteFile(Key: string) {
		const deleteParams = {
			Bucket: process.env.S3_BUCKET_NAME,
			Key: decodeURI(Key),
		};

		try {
			const command = new DeleteObjectCommand(deleteParams);
			const result = await this.s3.send(command);
			return result;
		} catch (error) {
			console.error("Error deleting file:", error);
			throw error;
		}
	}
}
