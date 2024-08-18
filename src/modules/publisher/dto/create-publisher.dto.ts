import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsUrl,
	Length,
	Matches,
	IsEmail,
	IsString,
	IsOptional,
	IsMobilePhone,
} from "class-validator";

import { ValidationMessage } from "src/common/enums/message.enum";

export class CreatePublisherDto {
	@ApiProperty({ example: "" })
	@IsString()
	@Length(1, 50)
	name: string;

	@ApiProperty({ example: "" })
	@IsString()
	@Matches(/^[a-zA-Z ]+$/, { message: "enName values must be entered in English" })
	@Length(1, 50)
	enName: string;

	@ApiProperty({ example: "" })
	@IsString()
	@Length(1, 400)
	bio: string;

	@ApiProperty({ format: "binary" })
	logo: string;

	@ApiProperty({ example: "" })
	@IsUrl()
	website: string;

	@ApiProperty({ example: "" })
	work_phone: string;

	@ApiPropertyOptional({ example: "" })
	@IsOptional()
	@IsMobilePhone("fa-IR", {}, { message: ValidationMessage.InvalidPhoneFormat })
	phone: string;

	@ApiPropertyOptional({ example: "" })
	@IsOptional()
	@IsString()
	address: string;

	@ApiPropertyOptional({ example: "" })
	@IsOptional()
	@IsEmail({}, { message: ValidationMessage.InvalidEmailFormat })
	email: string;

	@ApiPropertyOptional({ example: "" })
	@IsOptional()
	@IsString()
	@Length(1, 50)
	instagram: string;

	@ApiPropertyOptional({ example: "" })
	@IsOptional()
	@IsString()
	@Length(1, 50)
	telegram: string;
}
