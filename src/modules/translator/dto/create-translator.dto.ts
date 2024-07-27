import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsMobilePhone, IsOptional, IsString, Length } from "class-validator";

import { ValidationMessage } from "src/common/enums/message.enum";

export class CreateTranslatorDto {
	@ApiProperty({ example: "" })
	@Length(1, 50)
	@IsString()
	name: string;

	@ApiProperty({ example: "" })
	@Length(1, 50)
	@IsString()
	eName: string;

	@ApiPropertyOptional({ format: "binary" })
	@IsOptional()
	image: string;

	@ApiPropertyOptional({ example: "" })
	@IsOptional()
	@IsMobilePhone("fa-IR", {}, { message: ValidationMessage.InvalidPhoneFormat })
	phone: string;

	@ApiPropertyOptional({ example: "" })
	@IsString()
	@IsOptional()
	website: string;

	@ApiPropertyOptional({ example: "" })
	@IsString()
	@IsOptional()
	telegram: string;

	@ApiPropertyOptional({ example: "" })
	@IsString()
	@IsOptional()
	instagram: string;

	@ApiPropertyOptional({ example: "" })
	@IsString()
	@IsOptional()
	email: string;
}
