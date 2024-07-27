import { MaxFileSizeValidator, ParseFilePipe, UploadedFile, UploadedFiles } from "@nestjs/common";

export function Uploaded_File() {
	return UploadedFile(
		new ParseFilePipe({
			fileIsRequired: true,
			validators: [new MaxFileSizeValidator({ maxSize: 3000000 })],
		}),
	);
}

export function UploadedOptionalFile() {
	return UploadedFile(
		new ParseFilePipe({
			fileIsRequired: false,
			validators: [new MaxFileSizeValidator({ maxSize: 3000000 })],
		}),
	);
}

export function UploadedOptionalFiles() {
	return UploadedFiles(
		new ParseFilePipe({
			fileIsRequired: false,
			validators: [],
		}),
	);
}
