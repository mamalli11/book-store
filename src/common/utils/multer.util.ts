import { mkdirSync } from "fs";
import { Request } from "express";
import { extname, join } from "path";
import { diskStorage } from "multer";
import { BadRequestException } from "@nestjs/common";

import { ValidationMessage } from "../enums/message.enum";

export type CallbackDestination = (error: Error, destination: string) => void;
export type CallbackFilename = (error: Error, filename: string) => void;
export type MulterFile = Express.Multer.File;

export function multerDestination(fieldName: string) {
	return function (req: Request, file: MulterFile, callback: CallbackDestination): void {
		let path = join("public", "uploads", fieldName);
		mkdirSync(path, { recursive: true });
		callback(null, path);
	};
}
export function multerFilename(req: Request, file: MulterFile, callback: CallbackFilename): void {
	const ext = extname(file.originalname).toLowerCase();

	if (!isValidImageFormat(ext)) {
		callback(new BadRequestException(ValidationMessage.InvalidImageFormat), null);
	} else {
		const filename = `${Date.now()}${file.originalname.split(".")[0]}${ext}`;
		callback(null, filename);
	}
}
function isValidImageFormat(ext: string) {
	return [".png", ".jpg", ".jpeg", ".mp4"].includes(ext);
}
export function multerStorage(folderName: string) {
	return diskStorage({
		destination: multerDestination(folderName),
		filename: multerFilename,
	});
}
