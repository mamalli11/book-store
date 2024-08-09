import { ApiPropertyOptional } from "@nestjs/swagger";

enum QueryType {
	ASC = "ASC",
	DESC = "DESC",
}

export class PaginationDto {
	@ApiPropertyOptional({ type: "integer" })
	page: number;
	@ApiPropertyOptional({ type: "integer" })
	limit: number;
}

export class QueryDto {
	@ApiPropertyOptional({ enum: QueryType, default: QueryType.ASC })
	sort: string;
	@ApiPropertyOptional({ type: "string", default: "id" })
	sort_feild: string;
}
