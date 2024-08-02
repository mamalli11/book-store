import {
	IsUrl,
	IsEnum,
	Length,
	IsEmail,
	IsString,
	IsOptional,
	IsMobilePhone,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { GenderType } from "../enums/profile.enum";
import { ValidationMessage } from "src/common/enums/message.enum";

export class UpdateUserDto {
	@ApiPropertyOptional({ nullable: true, example: "" })
	@IsOptional()
	@IsString()
	@Length(3, 50)
	fname: string;
	@ApiPropertyOptional({ nullable: true, example: "" })
	@IsOptional()
	@IsString()
	@Length(3, 50)
	lname: string;
	@ApiPropertyOptional({ nullable: true, example: "" })
	@IsOptional()
	@IsString()
	@Length(0, 50)
	bio: string;
	@ApiPropertyOptional({ nullable: true, format: "binary" })
	@IsOptional()
	profile_picture: string;

	@ApiPropertyOptional({ nullable: true, example: "1999-02-22T12:01:26.487Z" })
	@IsOptional()
	birthday: Date;
	@ApiPropertyOptional({ nullable: true, enum: GenderType })
	@IsOptional()
	@IsEnum(GenderType)
	gender: GenderType;
	@ApiPropertyOptional({ nullable: true, example: "iran" })
	@IsOptional()
	@IsString()
	country: string;
	@ApiPropertyOptional({ nullable: true, example: "fa-ir" })
	@IsOptional()
	@IsString()
	@Length(0, 5)
	language: string;
}
export class ChangeEmailDto {
	@ApiProperty()
	@IsEmail({}, { message: ValidationMessage.InvalidEmailFormat })
	email: string;
}
export class ChangePhoneDto {
	@ApiProperty()
	@IsMobilePhone("fa-IR", {}, { message: ValidationMessage.InvalidPhoneFormat })
	phone: string;
}
