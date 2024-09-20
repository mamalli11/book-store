import { DeepPartial, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { I18nService, I18nContext } from "nestjs-i18n";
import { Injectable, NotFoundException } from "@nestjs/common";

import { S3Service } from "../s3/s3.service";
import { PublisherEntity } from "./entities/publisher.entity";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { UpdatePublisherDto } from "./dto/update-publisher.dto";
import { CreatePublisherDto } from "./dto/create-publisher.dto";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";

@Injectable()
export class PublisherService {
	constructor(
		@InjectRepository(PublisherEntity) private publisherRepository: Repository<PublisherEntity>,
		private s3Service: S3Service,
		private readonly i18n: I18nService,
	) {}

	async create(createPublisherDto: CreatePublisherDto, file: Express.Multer.File) {
		let s3Data = null;
		if (file) s3Data = await this.s3Service.uploadFile(file, "publisher");

		await this.publisherRepository.insert({
			...createPublisherDto,
			logo: s3Data?.Location ? s3Data.Location : null,
			logoKey: s3Data?.Key ? s3Data.Key : null,
		});

		return {
			message: this.i18n.t("tr.PublicMessage.CreatedPublisher", {
				lang: I18nContext.current().lang,
			}),
		};
	}

	async findAll(paginationDto: PaginationDto) {
		const { limit, page, skip } = paginationSolver(paginationDto);
		const [publisher, count] = await this.publisherRepository.findAndCount({
			where: {},
			skip,
			take: limit,
		});

		return { pagination: paginationGenerator(count, page, limit), publisher };
	}

	async findOne(id: number) {
		const publisher = await this.publisherRepository.findOneBy({ id });
		if (!publisher)
			throw new NotFoundException(
				this.i18n.t("tr.NotFoundMessage.NotFoundPublisher", {
					lang: I18nContext.current().lang,
				}),
			);
		return publisher;
	}

	async update(id: number, updatePublisherDto: UpdatePublisherDto, file: Express.Multer.File) {
		const publisher = await this.findOne(id);
		const updateObject: DeepPartial<PublisherEntity> = {};

		if (file) {
			const { Location, Key } = await this.s3Service.uploadFile(file, "category");
			if (Location) {
				updateObject["logo"] = Location;
				updateObject["logoKey"] = Key;
				if (publisher.logoKey) await this.s3Service.deleteFile(publisher.logoKey);
			}
		}

		const { name, email, phone, enName, address, website, telegram, instagram, work_phone } =
			updatePublisherDto;

		if (name) updateObject["name"] = name;
		if (email) updateObject["email"] = email;
		if (phone) updateObject["phone"] = phone;
		if (enName) updateObject["enName"] = enName;
		if (address) updateObject["address"] = address;
		if (website) updateObject["website"] = website;
		if (telegram) updateObject["telegram"] = telegram;
		if (instagram) updateObject["instagram"] = instagram;
		if (work_phone) updateObject["work_phone"] = work_phone;

		await this.publisherRepository.update({ id }, updateObject);
		return {
			message: this.i18n.t("tr.PublicMessage.Updated", { lang: I18nContext.current().lang }),
		};
	}

	async remove(id: number) {
		const publisher = await this.findOne(id);
		await this.s3Service.deleteFile(publisher.logoKey);
		await this.publisherRepository.delete({ id });
		return {
			message: this.i18n.t("tr.PublicMessage.Deleted", { lang: I18nContext.current().lang }),
		};
	}
}
