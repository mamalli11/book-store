import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

import { DiscountType } from "../enums/discount.enum";

export class CreateDiscountDto {
	@ApiProperty({ example: "" })
	code: string;

	@ApiProperty({ enum: DiscountType, default: DiscountType.Percent })
	@IsEnum(DiscountType)
	type: DiscountType;

	@ApiProperty({ example: "2024-07-28T12:01:26.487Z" })
	start_at: Date;

	@ApiPropertyOptional({ example: "", description: "تعداد روز فعال بودن کد" })
	expires_in: number;

	@ApiPropertyOptional({ type: "double", example: "" })
	percent: number;

	@ApiPropertyOptional({ type: "double", example: "" })
	amount: number;

	@ApiPropertyOptional({ example: "" })
	limit: number;

}
