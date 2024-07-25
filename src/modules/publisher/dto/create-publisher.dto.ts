import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsMobilePhone, IsOptional, IsPhoneNumber, IsString, IsUrl, Length } from "class-validator";

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
	@IsString()
	@Length(3, 50)
	@IsUrl()
	website: string;

	@ApiProperty({ example: "" })
	@IsPhoneNumber("IR", { message: ValidationMessage.InvalidWorkPhoneFormat })
	@Length(11, 11)
	work_phone: string;

	@ApiPropertyOptional({ example: "" })
	@IsMobilePhone("fa-IR", {}, { message: ValidationMessage.InvalidPhoneFormat })
	@Length(11, 11)
	phone: string;

	@ApiPropertyOptional({ example: "" })
	@IsString()
	@IsOptional()
	@Length(10)
	address: string;

	@ApiPropertyOptional({ example: "" })
	@IsString()
	@IsOptional()
	@Length(4, 50)
	email: string;

	@ApiPropertyOptional({ example: "" })
	@IsString()
	@IsOptional()
	@Length(4, 50)
	instagram: string;

	@ApiPropertyOptional({ example: "" })
	@IsString()
	@IsOptional()
	@Length(4, 50)
	telegram: string;
}
