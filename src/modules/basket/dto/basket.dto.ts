import { ApiProperty } from "@nestjs/swagger";

export class BasketDto {
	@ApiProperty()
	bookId: number;
}

export class DiscountBasketDto {
	@ApiProperty()
	code: string;
}
