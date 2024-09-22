import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { I18nService, I18nContext } from "nestjs-i18n";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { TagsEntity } from "./entities/tag.entity";
import { CreateTagDto } from "./dto/create-tag.dto";

@Injectable()
export class TagsService {
	constructor(
		@InjectRepository(TagsEntity) private readonly tagsRepository: Repository<TagsEntity>,

		private readonly i18n: I18nService,
	) {}

	async create(createTagDto: CreateTagDto) {
		const { name } = createTagDto;
		if (!name || name.trim().length < 2)
			throw new BadRequestException(
				this.i18n.t("tr.BadRequestMessage.InvalidNameTags", {
					lang: I18nContext.current().lang,
				}),
			);
		await this.tagsRepository.insert({ name });
		return {
			message: this.i18n.t("tr.PublicMessage.CreatedTags", {
				lang: I18nContext.current().lang,
			}),
		};
	}

	async findAll(name: string) {
		if (!name || name.trim().length < 2)
			throw new BadRequestException(
				this.i18n.t("tr.BadRequestMessage.InvalidNameTags", {
					lang: I18nContext.current().lang,
				}),
			);

		const tags = await this.tagsRepository
			.createQueryBuilder("tags")
			.select(["tags.id", "tags.name"])
			.where("tags.name ILIKE :query", { query: `%${name}%` })
			.getMany();
		return tags;
	}

	async usedThisTag(id: number) {
		return `This action returns a #${id} tag`;
	}

	async remove(id: number) {
		const tag = await this.tagsRepository.findOneBy({ id });
		if (!tag) {
			throw new NotFoundException(
				this.i18n.t("tr.NotFoundMessage.NotFound", {
					lang: I18nContext.current().lang,
				}),
			);
		}
		await this.tagsRepository.delete(id);
		return {
			message: this.i18n.t("tr.PublicMessage.Deleted", {
				lang: I18nContext.current().lang,
			}),
		};
	}
}
