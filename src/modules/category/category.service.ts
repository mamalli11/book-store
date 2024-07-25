import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";

import { CategoryEntity } from "./entities/category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";
import { ConflictMessage, NotFoundMessage, PublicMessage } from "src/common/enums/message.enum";

@Injectable()
export class CategoryService {
	constructor(
		@InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>,
	) {}

	async create(file: Express.Multer.File, createCategoryDto: CreateCategoryDto) {
		if (file) createCategoryDto.image = file?.path?.slice(7);
		const { slug, title } = createCategoryDto;

		await this.checkExistAndResolveTitle(title, slug);

		await this.categoryRepository.insert({ ...createCategoryDto });

		return { message: PublicMessage.CreatedCategory };
	}

	async findAll(paginationDto: PaginationDto) {
		const { limit, page, skip } = paginationSolver(paginationDto);
		const [categories, count] = await this.categoryRepository.findAndCount({
			where: {},
			relations: {
				parent: true,
			},
			select: {
				parent: {
					title: true,
					id: true,
				},
			},
			skip,
			take: limit,
			// order: { id: "DESC" },
		});
		return {
			pagination: paginationGenerator(count, page, limit),
			categories,
		};
	}

	async findOneById(id: number) {
		const category = await this.categoryRepository.findOneBy({ id });
		if (!category) throw new NotFoundException("category not found");
		return category;
	}

	async findOneBySlug(slug: string) {
		return await this.categoryRepository.findOneBy({ slug });
	}

	async findBySlug(slug: string) {
		const category = await this.categoryRepository.findOne({
			where: { slug },
			relations: {
				children: true,
			},
		});
		if (!category) throw new NotFoundException("not found this category slug ");
		return {
			category,
		};
	}

	async update(id: number, updateCategoryDto: UpdateCategoryDto, file: Express.Multer.File) {
		if (file) updateCategoryDto.image = file?.path?.slice(7);

		const category = await this.findOneById(id);
		const { slug, title, parentId, image } = updateCategoryDto;

		if (title) category.title = title;
		if (slug) category.slug = slug;
		if (parentId) category.parentId = parentId;
		if (image) category.image = image;

		await this.categoryRepository.save(category);
		return { message: PublicMessage.Updated };
	}

	async remove(id: number) {
		await this.findOneById(id);
		await this.categoryRepository.delete({ id });
		return { message: PublicMessage.Deleted };
	}

	async checkExistAndResolveTitle(title: string, slug: string) {
		const category = await this.categoryRepository.findOneBy({ title });
		if (category) throw new ConflictException(ConflictMessage.CategoryTitle);

		const enCategory = await this.categoryRepository.findOneBy({ slug });
		if (enCategory) throw new ConflictException("enTitle " + ConflictMessage.CategoryTitle);

		return slug;
	}
}
