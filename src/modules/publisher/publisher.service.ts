import { join } from "path";
import { unlink } from "fs";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";

import { PublisherEntity } from "./entities/publisher.entity";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { UpdatePublisherDto } from "./dto/update-publisher.dto";
import { CreatePublisherDto } from "./dto/create-publisher.dto";
import { NotFoundMessage, PublicMessage } from "src/common/enums/message.enum";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";

@Injectable()
export class PublisherService {
	constructor(
		@InjectRepository(PublisherEntity) private publisherRepository: Repository<PublisherEntity>,
	) {}

	async create(createPublisherDto: CreatePublisherDto, file: Express.Multer.File) {
		if (file) {
			const path = file?.path?.slice(7);
			createPublisherDto.logo = path.replaceAll("\\", "/");
		}

		await this.publisherRepository.insert({ ...createPublisherDto });

		return { message: PublicMessage.CreatedPublisher };
	}

	async findAll(paginationDto: PaginationDto) {
		const { limit, page, skip } = paginationSolver(paginationDto);
		const [publisher, count] = await this.publisherRepository.findAndCount({
			where: {},
			skip,
			take: limit,
		});

		return {
			pagination: paginationGenerator(count, page, limit),
			publisher,
		};
	}

	async findOne(id: number) {
		const publisher = await this.publisherRepository.findOneBy({ id });
		if (!publisher) throw new NotFoundException(NotFoundMessage.NotFoundPublisher);
		return publisher;
	}

	async update(id: number, updatePublisherDto: UpdatePublisherDto, file: Express.Multer.File) {
		const publisher = await this.findOne(id);

		if (file) {
			const imageFullPath = join(__dirname, "..", "..", "..", "public", publisher.logo);
			unlink(imageFullPath, (err) => {
				if (err) {
					console.error("Error deleting old image:", err);
				}
			});
			updatePublisherDto.logo = file?.path?.slice(7);
		}

		const {
			name,
			logo,
			email,
			phone,
			enName,
			address,
			website,
			telegram,
			instagram,
			work_phone,
		} = updatePublisherDto;

		if (name) publisher.name = name;
		if (logo) publisher.logo = logo;
		if (email) publisher.email = email;
		if (phone) publisher.phone = phone;
		if (enName) publisher.enName = enName;
		if (website) publisher.website = website;
		if (address) publisher.address = address;
		if (telegram) publisher.telegram = telegram;
		if (instagram) publisher.instagram = instagram;
		if (work_phone) publisher.work_phone = work_phone;

		await this.publisherRepository.save(publisher);
		return { message: PublicMessage.Updated };
	}

	async remove(id: number) {
		const publisher = await this.findOne(id);

		const imageFullPath = join(__dirname, "..", "..", "..", "public", publisher.logo);
		unlink(imageFullPath, (err) => {
			if (err) {
				console.error("Error deleting old image:", err);
			}
		});

		await this.publisherRepository.delete({ id });
		return { message: PublicMessage.Deleted };
	}
}
