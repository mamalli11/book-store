import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumberString, IsOptional, IsString, Length } from "class-validator";

export class CreateCommentDto {
	@ApiProperty({ example: "" })
	@Length(5)
	@IsString()
	text: string;

	@ApiProperty({ example: "" })
	@IsNumberString()
	bookId: number;

	@ApiPropertyOptional({ example: "" })
	@IsOptional()
	@IsNumberString()
	parentId: number;
}

export class updateCommentDto {
	@ApiProperty({ example: "" })
	@Length(5)
	@IsString()
	text: string;
}
