import { DeepPartial, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { I18nService, I18nContext } from "nestjs-i18n";
import { Injectable, NotFoundException } from "@nestjs/common";

import { S3Service } from "../s3/s3.service";
import { EditorEntity } from "./entities/editor.entity";
import { CreateEditorDto } from "./dto/create-editor.dto";
import { UpdateEditorDto } from "./dto/update-editor.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";

@Injectable()
export class EditorService {
	constructor(
		@InjectRepository(EditorEntity) private editorRepository: Repository<EditorEntity>,
		private s3Service: S3Service,
		private readonly i18n: I18nService,
	) {}

	async create(createEditorDto: CreateEditorDto, file: Express.Multer.File) {
		let s3Data = null;
		if (file) s3Data = await this.s3Service.uploadFile(file, "editor");

		await this.editorRepository.insert({
			...createEditorDto,
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
		const [editor, count] = await this.editorRepository.findAndCount({
			where: {},
			skip,
			take: limit,
		});

		return { pagination: paginationGenerator(count, page, limit), editor };
	}

	async findOne(id: number) {
		const editor = await this.editorRepository.findOneBy({ id });
		if (!editor)
			throw new NotFoundException(
				this.i18n.t("tr.NotFoundMessage.NotFoundEditor", {
					lang: I18nContext.current().lang,
				}),
			);
		return editor;
	}

	async update(id: number, updateEditorDto: UpdateEditorDto, file: Express.Multer.File) {
		const editor = await this.findOne(id);
		const updateObject: DeepPartial<EditorEntity> = {};

		if (file) {
			const { Location, Key } = await this.s3Service.uploadFile(file, "editor");
			if (Location) {
				updateObject["image"] = Location;
				updateObject["imageKey"] = Key;
				if (editor?.imageKey) await this.s3Service.deleteFile(editor?.imageKey);
			}
		}

		const { enName, name, instagram, phone, telegram, website, email } = updateEditorDto;

		if (name) updateObject["name"] = name;
		if (phone) updateObject["phone"] = phone;
		if (email) updateObject["email"] = email;
		if (enName) updateObject["enName"] = enName;
		if (website) updateObject["website"] = website;
		if (telegram) updateObject["telegram"] = telegram;
		if (instagram) updateObject["instagram"] = instagram;

		await this.editorRepository.update({ id }, updateObject);
		return {
			message: this.i18n.t("tr.PublicMessage.Updated", { lang: I18nContext.current().lang }),
		};
	}

	async remove(id: number) {
		const editor = await this.findOne(id);
		if (editor.imageKey) await this.s3Service.deleteFile(editor.imageKey);
		await this.editorRepository.delete({ id });
		return {
			message: this.i18n.t("tr.PublicMessage.Deleted", { lang: I18nContext.current().lang }),
		};
	}
}
