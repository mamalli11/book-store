import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";

import { CategoryEntity } from "./entities/category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { ConflictMessage, NotFoundMessage, PublicMessage } from "src/common/enums/message.enum";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";

@Injectable()
export class CategoryService {
	constructor(
		@InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>,
	) {}

	async create(file: Express.Multer.File, createCategoryDto: CreateCategoryDto) {
		if (file) createCategoryDto.image = file?.path?.slice(7);
		const { enTitle, title } = createCategoryDto;

		await this.checkExistAndResolveTitle(title, enTitle);

		await this.categoryRepository.insert({ ...createCategoryDto });

		return { message: PublicMessage.CreatedCategory };
	}

	async findAll(paginationDto: PaginationDto) {
		const { limit, page, skip } = paginationSolver(paginationDto);
		const [categories, count] = await this.categoryRepository.findAndCount({
			where: {},
			skip,
			take: limit,
		});
		return {
			pagination: paginationGenerator(count, page, limit),
			categories,
		};
	}

	async findOne(id: number) {
		const category = await this.categoryRepository.findOneBy({ id });
		if (!category) throw new NotFoundException(NotFoundMessage.NotFoundCategory);
		return category;
	}

	async update(id: number, updateCategoryDto: UpdateCategoryDto, file: Express.Multer.File) {
		if (file) updateCategoryDto.image = file?.path?.slice(7);

		const category = await this.findOne(id);
		const { enTitle, title, parentId, image } = updateCategoryDto;

		if (title) category.title = title;
		if (enTitle) category.enTitle = enTitle;
		if (parentId) category.parentId = parentId;
		if (image) category.image = image;

		await this.categoryRepository.save(category);
		return { message: PublicMessage.Updated };
	}

	async remove(id: number) {
		await this.findOne(id);
		await this.categoryRepository.delete({ id });
		return { message: PublicMessage.Deleted };
	}

	async checkExistAndResolveTitle(title: string, enTitle: string) {
		const category = await this.categoryRepository.findOneBy({ title });
		if (category) throw new ConflictException(ConflictMessage.CategoryTitle);

		const enCategory = await this.categoryRepository.findOneBy({ enTitle });
		if (enCategory) throw new ConflictException("enTitle " + ConflictMessage.CategoryTitle);
		console.log({ category, enCategory });
		console.log({ title, enTitle });

		return enTitle;
	}
}
