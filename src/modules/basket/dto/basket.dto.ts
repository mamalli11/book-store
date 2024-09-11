import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsString, Length } from "class-validator";

export class BasketDto {
	@ApiProperty({ example: "" })
	@IsNumberString()
	@Length(1)
	bookId: number;
}

export class DiscountBasketDto {
	@ApiProperty({ example: "" })
	@IsString()
	@Length(3)
	code: string;
}
