import { join } from "path";
import { unlink } from "fs";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";

import { PaginationDto } from "src/common/dtos/pagination.dto";
import { TranslatorEntity } from "./entities/translator.entity";
import { DefaultPath } from "src/common/enums/default-path.enum";
import { CreateTranslatorDto } from "./dto/create-translator.dto";
import { UpdateTranslatorDto } from "./dto/update-translator.dto";
import { NotFoundMessage, PublicMessage } from "src/common/enums/message.enum";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";

@Injectable()
export class TranslatorService {
	constructor(
		@InjectRepository(TranslatorEntity)
		private translatorRepository: Repository<TranslatorEntity>,
	) {}

	async create(createTranslatorDto: CreateTranslatorDto, file: Express.Multer.File) {
		if (file) {
			const path = file?.path?.slice(7);
			createTranslatorDto.image = path.replaceAll("\\", "/");
		}

		await this.translatorRepository.insert({ ...createTranslatorDto });

		return { message: PublicMessage.CreatedTranslator };
	}

	async findAll(paginationDto: PaginationDto) {
		const { limit, page, skip } = paginationSolver(paginationDto);
		const [translator, count] = await this.translatorRepository.findAndCount({
			where: {},
			skip,
			take: limit,
		});

		return {
			pagination: paginationGenerator(count, page, limit),
			translator,
		};
	}

	async findOne(id: number) {
		const translator = await this.translatorRepository.findOneBy({ id });
		if (!translator) throw new NotFoundException(NotFoundMessage.NotFoundTranslator);
		return translator;
	}

	async update(id: number, updateTranslatorDto: UpdateTranslatorDto, file: Express.Multer.File) {
		const translator = await this.findOne(id);

		if (translator.image !== DefaultPath.UserProfile) {
			const imageFullPath = join(__dirname, "..", "..", "..", "public", translator.image);

			unlink(imageFullPath, (err) => {
				if (err) {
					console.error("Error deleting old image:", err);
				} else {
					console.log("Old image deleted successfully");
				}
			});
		}

		const { eName, name, image, instagram, phone, telegram, website, email } =
			updateTranslatorDto;

		if (eName) translator.eName = eName;
		if (name) translator.name = name;
		if (email) translator.email = email;
		if (instagram) translator.instagram = instagram;
		if (phone) translator.phone = phone;
		if (telegram) translator.telegram = telegram;
		if (website) translator.website = website;
		if (image) translator.image = image;

		await this.translatorRepository.save(translator);
		return { message: PublicMessage.Updated };
	}

	async remove(id: number) {
		const translator = await this.findOne(id);

		if (translator.image !== DefaultPath.UserProfile) {
			const imageFullPath = join(__dirname, "..", "..", "..", "public", translator.image);

			unlink(imageFullPath, (err) => {
				if (err) {
					console.error("Error deleting old image:", err);
				} else {
					console.log("Old image deleted successfully");
				}
			});
		}
		await this.translatorRepository.delete({ id });
		return { message: PublicMessage.Deleted };
	}
}
