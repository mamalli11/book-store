import { DeepPartial, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { I18nService, I18nContext } from "nestjs-i18n";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";

import { S3Service } from "../s3/s3.service";
import { CategoryEntity } from "./entities/category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { toBoolean, isBoolean } from "src/common/utils/function.utils";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";

@Injectable()
export class CategoryService {
	constructor(
		@InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>,
		private s3Service: S3Service,
		private readonly i18n: I18nService,
	) {}

	async create(createCategoryDto: CreateCategoryDto, file: Express.Multer.File) {
		let s3Data = null;
		if (file) s3Data = await this.s3Service.uploadFile(file, "category");

		let { slug, title, show } = createCategoryDto;

		await this.checkExistAndResolveTitle(title, slug);

		if (isBoolean(show)) createCategoryDto.show = toBoolean(show);

		await this.categoryRepository.insert({
			...createCategoryDto,
			image: s3Data?.Location ? s3Data.Location : null,
			imageKey: s3Data?.Key ? s3Data.Key : null,
		});

		return {
			message: this.i18n.t("tr.PublicMessage.CreatedCategory", {
				lang: I18nContext.current().lang,
			}),
		};
	}

	async findAll(paginationDto: PaginationDto) {
		const { limit, page, skip } = paginationSolver(paginationDto);
		const [categories, count] = await this.categoryRepository.findAndCount({
			where: {},
			relations: { parent: true },
			select: {
				parent: {
					title: true,
					id: true,
				},
			},
			skip,
			take: limit,
			order: { id: "ASC" },
		});
		return {
			pagination: paginationGenerator(count, page, limit),
			categories,
		};
	}

	async findOneById(id: number) {
		const category = await this.categoryRepository.findOneBy({ id });
		if (!category)
			throw new NotFoundException(
				this.i18n.t("tr.NotFoundMessage.NotFoundCategory", {
					lang: I18nContext.current().lang,
				}),
			);
		return category;
	}

	async findOneBySlug(slug: string) {
		return await this.categoryRepository.findOneBy({ slug });
	}

	async findBySlug(slug: string) {
		const category = await this.categoryRepository.findOne({
			where: { slug },
			relations: { children: true },
		});
		if (!category)
			throw new NotFoundException(
				this.i18n.t("tr.NotFoundMessage.NotFoundCategoryBySlug", {
					lang: I18nContext.current().lang,
				}),
			);
		return { category };
	}

	async update(id: number, updateCategoryDto: UpdateCategoryDto, file: Express.Multer.File) {
		const category = await this.findOneById(id);
		const { slug, title, parentId, show } = updateCategoryDto;

		const updateObject: DeepPartial<CategoryEntity> = {};
		if (file) {
			const { Location, Key } = await this.s3Service.uploadFile(file, "category");
			if (Location) {
				updateObject["image"] = Location;
				updateObject["imageKey"] = Key;
				if (category?.imageKey) await this.s3Service.deleteFile(category?.imageKey);
			}
		}
		if (title) updateObject["title"] = title;
		if (show && isBoolean(show)) updateObject["show"] = toBoolean(show);
		if (parentId && !isNaN(parseInt(parentId.toString()))) {
			const category = await this.findOneById(+parentId);
			if (!category)
				throw new NotFoundException(
					this.i18n.t("tr.NotFoundMessage.NotFoundCategoryParent", {
						lang: I18nContext.current().lang,
					}),
				);
			updateObject["parentId"] = category.id;
		}
		if (slug) {
			const category = await this.categoryRepository.findOneBy({ slug });
			if (category && category.id !== id)
				throw new ConflictException(
					this.i18n.t("tr.ConflictMessage.CategorySlug", { lang: I18nContext.current().lang }),
				);
			updateObject["slug"] = slug;
		}

		await this.categoryRepository.update({ id }, updateObject);
		return {
			message: this.i18n.t("tr.PublicMessage.Updated", { lang: I18nContext.current().lang }),
		};
	}

	async remove(id: number) {
		const category = await this.findOneById(id);
		if (category.imageKey) await this.s3Service.deleteFile(category.imageKey);
		await this.categoryRepository.delete({ id });
		return {
			message: this.i18n.t("tr.PublicMessage.Deleted", { lang: I18nContext.current().lang }),
		};
	}

	async checkExistAndResolveTitle(title: string, slug: string) {
		const category = await this.categoryRepository.findOneBy({ title });
		if (category)
			throw new ConflictException(
				this.i18n.t("tr.ConflictMessage.CategoryTitle", { lang: I18nContext.current().lang }),
			);

		const slugCategory = await this.categoryRepository.findOneBy({ slug });
		if (slugCategory)
			throw new ConflictException(
				this.i18n.t("tr.ConflictMessage.CategorySlug", { lang: I18nContext.current().lang }),
			);

		return true;
	}
}
