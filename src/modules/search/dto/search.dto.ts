import { IsString, IsOptional, IsInt, Min, Length, IsEnum } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

enum OrderType {
	ASC = "ASC",
	DESC = "DESC",
}

export class SearchDto {
	@ApiProperty({ example: "" })
	@Length(2)
	@IsString()
	query: string;

	@ApiPropertyOptional({ example: "" })
	@IsOptional()
	@Length(2)
	@IsString()
	filters: string;

	@ApiPropertyOptional({ example: "" })
	@IsOptional()
	@Length(2)
	@IsString()
	sortBy: string;

	@ApiPropertyOptional({ default: OrderType.ASC, enum: OrderType })
	@IsOptional()
	@IsEnum(OrderType)
	order: OrderType;

	@ApiPropertyOptional({ default: 1 })
	@IsOptional()
	page: number;

	@ApiPropertyOptional({ default: 10 })
	@IsOptional()
	pageSize: number;
}
