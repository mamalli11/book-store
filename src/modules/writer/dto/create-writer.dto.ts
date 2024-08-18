import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsUrl,
	Length,
	IsEmail,
	Matches,
	IsString,
	IsOptional,
	IsMobilePhone,
} from "class-validator";

export class CreateWriterDto {
	@ApiProperty({ example: "" })
	@IsString()
	@Length(1, 50)
	name: string;

	@ApiProperty({ example: "" })
	@IsString()
	@Length(1, 50)
	@Matches(/^[a-zA-Z ]+$/, { message: "enName values must be entered in English" })
	enName: string;

	@ApiPropertyOptional({ format: "binary" })
	@IsOptional()
	image: string;

	@ApiProperty({ example: "" })
	@IsString()
	@Length(1, 400)
	bio: string;

	@ApiPropertyOptional({ example: "1996-02-22T12:01:26.487Z" })
	@IsOptional()
	birthday: Date;

	@ApiPropertyOptional({ example: "" })
	@IsOptional()
	@IsEmail()
	email: string;

	@ApiPropertyOptional({ example: "" })
	@IsOptional()
	@IsMobilePhone("fa-IR", {}, { message: "your phone number format is incorrect" })
	phone: string;

	@ApiPropertyOptional({ example: "" })
	@IsString()
	@IsOptional()
	instagram: string;

	@ApiPropertyOptional({ example: "" })
	@IsString()
	@IsOptional()
	telegram: string;

	@ApiPropertyOptional({ example: "", nullable: true })
	@IsOptional()
	@IsUrl({}, { message: "your website format is incorrect" })
	website: string;
}
