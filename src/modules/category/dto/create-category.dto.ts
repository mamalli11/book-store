import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsNumberString, IsOptional, IsString, Length } from "class-validator";

export class CreateCategoryDto {
	@ApiProperty({ example: "" })
	@IsString()
	@Length(1, 50)
	title: string;

	@ApiProperty({ example: "" })
	@IsString()
	@Length(1, 50)
	enTitle: string;

	@ApiPropertyOptional({ example: "" })
	@IsNumberString()
	@IsOptional()
	parentId: number;

	@ApiPropertyOptional({ nullable: true, format: "binary" })
	@IsOptional()
	image: string;
}
