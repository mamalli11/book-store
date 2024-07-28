import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsMobilePhone, IsOptional, IsString, IsUrl, Length } from "class-validator";

import { ValidationMessage } from "src/common/enums/message.enum";

export class CreatePublisherDto {
	@ApiProperty({ example: "" })
	@IsString()
	@Length(1, 50)
	name: string;

	@ApiProperty({ example: "" })
	@IsString()
	@Length(1, 50)
	enName: string;

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
