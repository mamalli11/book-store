import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";

import { BookImagesType } from "./types/up_files";
import { BookEntity } from "./entities/book.entity";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { RelationShipType } from "./types/relationship";
import { ImagesBookEntity } from "./entities/images.entity";
import { NotFoundMessage, PublicMessage } from "src/common/enums/message.enum";
import { EditorService } from "../editor/editor.service";
import { S3Service } from "../s3/s3.service";
import { WriterService } from "../writer/writer.service";
import { CategoryService } from "../category/category.service";
import { PublisherService } from "../publisher/publisher.service";
import { TranslatorService } from "../translator/translator.service";

@Injectable()
export class BooksService {
	constructor(
		@InjectRepository(BookEntity) private bookRepository: Repository<BookEntity>,
		@InjectRepository(ImagesBookEntity)
		private imagesBookRepository: Repository<ImagesBookEntity>,
		private s3Service: S3Service,
		private editorService: EditorService,
		private writerService: WriterService,
		private categoryService: CategoryService,
		private publisherService: PublisherService,
		private translatorService: TranslatorService,
	) {}

	async create(createBookDto: CreateBookDto, files: BookImagesType) {
		const { editorId, writerId, categoryId, publisherId, translatorId } = createBookDto;
		await this.checkExistRelationship({
			editorId,
			writerId,
			categoryId,
			publisherId,
			translatorId,
		});

		const book = await this.bookRepository.save(this.bookRepository.create({ ...createBookDto }));

		if (files) {
			Object.keys(files).map(async (k) => {
				const imageResult = await this.s3Service.uploadFile(files[k][0], "books");
				await this.imagesBookRepository.save(
					this.imagesBookRepository.create({
						image: imageResult.Location,
						imageKey: imageResult.Key,
						bookId: book.id,
					}),
				);
			});
		}

		return { message: PublicMessage.CreatedBook };
	}

	async findAll() {
		return `This action returns all books`;
	}

	async findOne(id: number) {
		return `This action returns a #${id} book`;
	}

	async update(id: number, updateBookDto: UpdateBookDto) {
		return `This action updates a #${id} book`;
	}

	async remove(id: number) {
		return `This action removes a #${id} book`;
	}

	async checkExistBlogById(id: number) {
		const book = await this.bookRepository.findOneBy({ id });
		if (!book) throw new NotFoundException(NotFoundMessage.NotFoundBook);
		return book;
	}

	async checkExistRelationship(relationShipType: RelationShipType) {
		const { categoryId, editorId, publisherId, writerId, translatorId } = relationShipType;

		if (categoryId) await this.categoryService.findOneById(categoryId);
		if (editorId) await this.editorService.findOne(editorId);
		if (publisherId) await this.publisherService.findOne(publisherId);
		if (writerId) await this.writerService.findOne(writerId);
		if (translatorId) await this.translatorService.findOne(translatorId);

		return true;
	}
}
