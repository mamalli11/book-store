import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

import { DiscountType } from "../enums/discount.enum";

export class CreateDiscountDto {
	@ApiProperty({ example: "" })
	code: string;

	@ApiProperty({ enum: DiscountType, default: DiscountType.Percent })
	@IsEnum(DiscountType)
	type: DiscountType;

	@ApiProperty({ example: new Date().toISOString() })
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

export class UpdateDiscountDto extends PartialType(CreateDiscountDto) {}
