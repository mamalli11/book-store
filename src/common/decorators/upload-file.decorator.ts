import {
	UploadedFile,
	UploadedFiles,
	ParseFilePipe,
	FileTypeValidator,
	MaxFileSizeValidator,
} from "@nestjs/common";

export function Uploaded_File() {
	return UploadedFile(
		new ParseFilePipe({
			fileIsRequired: true,
			validators: [new MaxFileSizeValidator({ maxSize: 3 * 1024 * 1024 })],
		}),
	);
}

export function UploadedOptionalFile() {
	return UploadedFile(
		new ParseFilePipe({
			fileIsRequired: false,
			validators: [
				new MaxFileSizeValidator({ maxSize: 3 * 1024 * 1024 }),
				new FileTypeValidator({ fileType: "image/(png|jpg|jpeg|webp)" }),
			],
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
