import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsEmail,
	IsEmpty,
	IsMobilePhone,
	IsOptional,
	IsString,
	IsUrl,
	Length,
} from "class-validator";

export class CreateWriterDto {
	@ApiProperty({ example: "" })
	@IsString()
	@Length(1, 50)
	fullname: string;

	@ApiProperty({ example: "" })
	@IsString()
	@Length(1, 50)
	enFullName: string;

	@ApiPropertyOptional({ format: "binary" })
	image: string;

	@ApiProperty({ example: "" })
	@IsString()
	@Length(1, 200)
	bio: string;

	@ApiPropertyOptional({ example: "1996-02-22T12:01:26.487Z" })
	birthday: Date;

	@ApiPropertyOptional({ example: "" })
	@IsEmail()
	email: string;

	@ApiPropertyOptional({ example: "" })
	@IsMobilePhone("fa-IR", {}, { message: "your phone number format is incorrect" })
	phone: string;

	@ApiPropertyOptional({ example: "" })
	@IsString()
	instagram: string;

	@ApiPropertyOptional({ example: "" })
	@IsString()
	telegram: string;

	@ApiPropertyOptional({ example: "", nullable: true })
	@IsOptional()
	@IsUrl({}, { message: "your website format is incorrect" })
	website: string;
}
