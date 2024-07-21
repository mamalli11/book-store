import { Repository } from "typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { unlink } from "fs";
import { join } from "path";

import { WriterEntity } from "./entities/writer.entity";
import { CreateWriterDto } from "./dto/create-writer.dto";
import { UpdateWriterDto } from "./dto/update-writer.dto";
import { NotFoundMessage, PublicMessage } from "src/common/enums/message.enum";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";
import { PaginationDto } from "src/common/dtos/pagination.dto";

@Injectable()
export class WriterService {
	constructor(
		@InjectRepository(WriterEntity) private writerRepository: Repository<WriterEntity>,
	) {}

	async create(file: Express.Multer.File, createWriterDto: CreateWriterDto) {
		if (file) createWriterDto.image = file?.path?.slice(7);

		await this.writerRepository.insert({
			...createWriterDto,
		});

		return { message: PublicMessage.CreatedWriter };
	}

	async findAll(paginationDto: PaginationDto) {
		const { limit, page, skip } = paginationSolver(paginationDto);
		const [categories, count] = await this.writerRepository.findAndCount({
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
		const writer = await this.writerRepository.findOneBy({ id });
		if (!writer) throw new NotFoundException(NotFoundMessage.NotFoundWriter);
		return writer;
	}

	async update(file: Express.Multer.File, id: number, updateWriterDto: UpdateWriterDto) {
		const writer = await this.findOne(id);
		console.log("image ", writer.image);

		if (file) {
			// حذف قسمت http://localhost:3000/ از آدرس
			const baseUrl = "http://localhost:3000/";
			if (writer.image.startsWith(baseUrl)) {
				const oldImagePath = writer.image.replace(baseUrl, "");
				const oldImageFullPath = join(__dirname, "..", "..", "..", "public", oldImagePath);
				console.log("oldImage ", oldImageFullPath);

				// حذف تصویر قدیمی
				unlink(oldImageFullPath, (err) => {
					if (err) {
						console.error("Error deleting old image:", err);
					} else {
						console.log("Old image deleted successfully");
					}
				});
			}
		}

		const {
			bio,
			birthday,
			email,
			enFullName,
			fullname,
			image,
			instagram,
			phone,
			telegram,
			website,
		} = updateWriterDto;

		if (fullname) writer.fullname = fullname;
		if (enFullName) writer.enFullName = enFullName;
		if (bio) writer.bio = bio;
		if (birthday) writer.birthday = birthday;
		if (email) writer.email = email;
		if (instagram) writer.instagram = instagram;
		if (phone) writer.phone = phone;
		if (telegram) writer.telegram = telegram;
		if (website) writer.website = website;
		if (image) writer.image = image;

		await this.writerRepository.save(writer);
		return { message: PublicMessage.Updated };
	}

	async remove(id: number) {
		const writer = await this.findOne(id);
		const baseUrl = "http://localhost:3000/";
		if (writer.image.startsWith(baseUrl)) {
			const oldImagePath = writer.image.replace(baseUrl, "");
			const oldImageFullPath = join(__dirname, "..", "..", "..", "public", oldImagePath);
			console.log("oldImage ", oldImageFullPath);

			unlink(oldImageFullPath, (err) => {
				if (err) {
					console.error("Error deleting old image:", err);
				} else {
					console.log("Old image deleted successfully");
				}
			});
		}
		await this.writerRepository.delete({ id });
		return { message: PublicMessage.Deleted };
	}
}
