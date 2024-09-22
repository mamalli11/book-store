import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { Controller, Get, Query } from "@nestjs/common";

import { SearchService } from "./search.service";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { SearchDto } from "./dto/search.dto";

@Controller("search")
@ApiTags("Search")
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	@Get()
	@ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
	async search(@Query("q") query: string) {
		return this.searchService.search(query);
	}

	@Get("advancedSearch")
	async advancedSearch(@Query() searchDto: SearchDto) {
		return this.searchService.advancedSearch(searchDto);
	}
}
