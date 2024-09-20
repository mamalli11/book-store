import { DeepPartial, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { I18nService, I18nContext } from "nestjs-i18n";
import { Injectable, NotFoundException } from "@nestjs/common";

import { S3Service } from "../s3/s3.service";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { TranslatorEntity } from "./entities/translator.entity";
import { CreateTranslatorDto } from "./dto/create-translator.dto";
import { UpdateTranslatorDto } from "./dto/update-translator.dto";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";

@Injectable()
export class TranslatorService {
	constructor(
		@InjectRepository(TranslatorEntity)
		private translatorRepository: Repository<TranslatorEntity>,
		private s3Service: S3Service,
		private readonly i18n: I18nService,
	) {}

	async create(createTranslatorDto: CreateTranslatorDto, file: Express.Multer.File) {
		let s3Data = null;
		if (file) s3Data = await this.s3Service.uploadFile(file, "translator");

		await this.translatorRepository.insert({
			...createTranslatorDto,
			image: s3Data?.Location ? s3Data.Location : undefined,
			imageKey: s3Data?.Key ? s3Data.Key : null,
		});

		return {
			message: this.i18n.t("tr.PublicMessage.CreatedTranslator", {
				lang: I18nContext.current().lang,
			}),
		};
	}

	async findAll(paginationDto: PaginationDto) {
		const { limit, page, skip } = paginationSolver(paginationDto);
		const [translator, count] = await this.translatorRepository.findAndCount({
			where: {},
			skip,
			take: limit,
		});

		return { pagination: paginationGenerator(count, page, limit), translator };
	}

	async findOne(id: number) {
		const translator = await this.translatorRepository.findOneBy({ id });
		if (!translator)
			throw new NotFoundException(
				this.i18n.t("tr.NotFoundMessage.NotFoundTranslator", {
					lang: I18nContext.current().lang,
				}),
			);
		return translator;
	}

	async update(id: number, updateTranslatorDto: UpdateTranslatorDto, file: Express.Multer.File) {
		const translator = await this.findOne(id);
		const updateObject: DeepPartial<TranslatorEntity> = {};

		if (file) {
			const { Location, Key } = await this.s3Service.uploadFile(file, "category");
			if (Location) {
				updateObject["image"] = Location;
				updateObject["imageKey"] = Key;
				if (translator?.imageKey) await this.s3Service.deleteFile(translator?.imageKey);
			}
		}

		const { enName, name, instagram, phone, telegram, website, email } = updateTranslatorDto;

		if (name) updateObject["name"] = name;
		if (phone) updateObject["phone"] = phone;
		if (email) updateObject["email"] = email;
		if (enName) updateObject["enName"] = enName;
		if (website) updateObject["website"] = website;
		if (telegram) updateObject["telegram"] = telegram;
		if (instagram) updateObject["instagram"] = instagram;

		await this.translatorRepository.update({ id }, updateObject);
		return {
			message: this.i18n.t("tr.PublicMessage.Updated", {
				lang: I18nContext.current().lang,
			}),
		};
	}

	async remove(id: number) {
		const translator = await this.findOne(id);
		if (translator.imageKey) await this.s3Service.deleteFile(translator.imageKey);
		await this.translatorRepository.delete({ id });
		return {
			message: this.i18n.t("tr.PublicMessage.Deleted", {
				lang: I18nContext.current().lang,
			}),
		};
	}
}
