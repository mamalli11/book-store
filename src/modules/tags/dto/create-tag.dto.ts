import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CreateTagDto {
	@ApiProperty({ example: "" })
	@Length(2)
	@IsString()
	name: string;
}
