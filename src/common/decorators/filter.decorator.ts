import { ApiQuery } from "@nestjs/swagger";
import { applyDecorators } from "@nestjs/common";

export function FilterPost() {
	return applyDecorators(
		// ApiQuery({ name: "category", required: false }),
		ApiQuery({ name: "search", required: false }),
	);
}
