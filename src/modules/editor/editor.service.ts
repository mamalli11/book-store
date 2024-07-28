import { join } from "path";
import { unlink } from "fs";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";

import { EditorEntity } from "./entities/editor.entity";
import { CreateEditorDto } from "./dto/create-editor.dto";
import { UpdateEditorDto } from "./dto/update-editor.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { DefaultPath } from "src/common/enums/default-path.enum";
import { NotFoundMessage, PublicMessage } from "src/common/enums/message.enum";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";

@Injectable()
export class EditorService {
	constructor(
		@InjectRepository(EditorEntity) private editorRepository: Repository<EditorEntity>,
	) {}

	async create(createEditorDto: CreateEditorDto, file: Express.Multer.File) {
		if (file) {
			const path = file?.path?.slice(7);
			createEditorDto.image = path.replaceAll("\\", "/");
		}

		await this.editorRepository.insert({ ...createEditorDto });

		return { message: PublicMessage.CreatedTranslator };
	}

	async findAll(paginationDto: PaginationDto) {
		const { limit, page, skip } = paginationSolver(paginationDto);
		const [editor, count] = await this.editorRepository.findAndCount({
			where: {},
			skip,
			take: limit,
		});

		return {
			pagination: paginationGenerator(count, page, limit),
			editor,
		};
	}

	async findOne(id: number) {
		const editor = await this.editorRepository.findOneBy({ id });
		if (!editor) throw new NotFoundException(NotFoundMessage.NotFoundEditor);
		return editor;
	}

	async update(id: number, updateEditorDto: UpdateEditorDto, file: Express.Multer.File) {
		const editor = await this.findOne(id);

		if (file) {
			if (editor.image !== DefaultPath.UserProfile) {
				const imageFullPath = join(__dirname, "..", "..", "..", "public", editor.image);

				unlink(imageFullPath, (err) => {
					if (err) {
						console.error("Error deleting old image:", err);
					}
				});
			}
		}

		const { enName, name, image, instagram, phone, telegram, website, email } = updateEditorDto;

		if (name) editor.name = name;
		if (email) editor.email = email;
		if (image) editor.image = image;
		if (phone) editor.phone = phone;
		if (enName) editor.enName = enName;
		if (website) editor.website = website;
		if (telegram) editor.telegram = telegram;
		if (instagram) editor.instagram = instagram;

		await this.editorRepository.save(editor);
		return { message: PublicMessage.Updated };
	}

	async remove(id: number) {
		const editor = await this.findOne(id);

		if (editor.image !== DefaultPath.UserProfile) {
			const imageFullPath = join(__dirname, "..", "..", "..", "public", editor.image);

			unlink(imageFullPath, (err) => {
				if (err) {
					console.error("Error deleting old image:", err);
				}
			});
		}
		await this.editorRepository.delete({ id });
		return { message: PublicMessage.Deleted };
	}
}
