import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsNumberString, IsOptional, IsString, Length, Matches } from "class-validator";

export class CreateCategoryDto {
	@ApiProperty({ example: "" })
	@IsString()
	@Length(1, 50)
	title: string;

	@ApiProperty({ example: "" })
	@IsString()
	@Length(1, 50)
	@Matches(/^[a-zA-Z]+$/, { message: "enName values ​​must be entered in English" })
	slug: string;

	@ApiPropertyOptional({ nullable: true })
	parentId: number;

	@ApiPropertyOptional({ nullable: true, format: "binary" })
	@IsOptional()
	image: string;

	@ApiProperty({ type: "boolean" })
	show: boolean;
}
