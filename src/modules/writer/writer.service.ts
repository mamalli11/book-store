import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { I18nService, I18nContext } from "nestjs-i18n";
import { Injectable, NotFoundException } from "@nestjs/common";

import { S3Service } from "../s3/s3.service";
import { WriterEntity } from "./entities/writer.entity";
import { CreateWriterDto } from "./dto/create-writer.dto";
import { UpdateWriterDto } from "./dto/update-writer.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";

@Injectable()
export class WriterService {
	constructor(
		@InjectRepository(WriterEntity) private writerRepository: Repository<WriterEntity>,
		private s3Service: S3Service,
		private readonly i18n: I18nService,
	) {}

	async create(createWriterDto: CreateWriterDto, file: Express.Multer.File) {
		let s3Data = null;
		if (file) s3Data = await this.s3Service.uploadFile(file, "translator");

		await this.writerRepository.insert({
			...createWriterDto,
			image: s3Data?.Location ? s3Data.Location : undefined,
			imageKey: s3Data?.Key ? s3Data.Key : null,
		});

		return {
			message: this.i18n.t("tr.PublicMessage.CreatedWriter", {
				lang: I18nContext.current().lang,
			}),
		};
	}

	async findAll(paginationDto: PaginationDto) {
		const { limit, page, skip } = paginationSolver(paginationDto);
		const [writer, count] = await this.writerRepository.findAndCount({
			where: {},
			skip,
			take: limit,
		});

		return {
			pagination: paginationGenerator(count, page, limit),
			writer,
		};
	}

	async findOne(id: number) {
		const writer = await this.writerRepository.findOneBy({ id });
		if (!writer)
			throw new NotFoundException(
				this.i18n.t("tr.NotFoundMessage.NotFoundWriter", { lang: I18nContext.current().lang }),
			);
		return writer;
	}

	async update(id: number, updateWriterDto: UpdateWriterDto, file: Express.Multer.File) {
		const writer = await this.findOne(id);
		const updateObject: DeepPartial<WriterEntity> = {};

		if (file) {
			const { Location, Key } = await this.s3Service.uploadFile(file, "category");
			if (Location) {
				updateObject["image"] = Location;
				updateObject["imageKey"] = Key;
				if (writer?.imageKey) await this.s3Service.deleteFile(writer?.imageKey);
			}
		}

		const { bio, birthday, email, enName, name, instagram, phone, telegram, website } =
			updateWriterDto;

		if (bio) updateObject["bio"] = bio;
		if (name) updateObject["name"] = name;
		if (phone) updateObject["phone"] = phone;
		if (email) updateObject["email"] = email;
		if (enName) updateObject["enName"] = enName;
		if (website) updateObject["website"] = website;
		if (telegram) updateObject["telegram"] = telegram;
		if (birthday) updateObject["birthday"] = birthday;
		if (instagram) updateObject["instagram"] = instagram;

		await this.writerRepository.save(writer);
		return {
			message: this.i18n.t("tr.PublicMessage.Updated", { lang: I18nContext.current().lang }),
		};
	}

	async remove(id: number) {
		const writer = await this.findOne(id);
		if (writer.imageKey) await this.s3Service.deleteFile(writer.imageKey);
		await this.writerRepository.delete({ id });
		return {
			message: this.i18n.t("tr.PublicMessage.Deleted", { lang: I18nContext.current().lang }),
		};
	}
}
