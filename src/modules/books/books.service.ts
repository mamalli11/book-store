import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";

import { S3Service } from "../s3/s3.service";
import { BookImagesType } from "./types/up_files";
import { BookEntity } from "./entities/book.entity";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { RelationShipType } from "./types/relationship";
import { EditorService } from "../editor/editor.service";
import { WriterService } from "../writer/writer.service";
import { ImagesBookEntity } from "./entities/images.entity";
import { CategoryService } from "../category/category.service";
import { PublisherService } from "../publisher/publisher.service";
import { BookWritersEntity } from "./entities/bookWriters.entity";
import { BookEditorsEntity } from "./entities/bookEditors.entity";
import { TranslatorService } from "../translator/translator.service";
import { BookCategorysEntity } from "./entities/bookCategory.entity";
import { BookPublishersEntity } from "./entities/bookpublishers.entity";
import { PaginationDto, QueryDto } from "src/common/dtos/pagination.dto";
import { BookTranslatorsEntity } from "./entities/bookTranslators.entity";
import { NotFoundMessage, PublicMessage } from "src/common/enums/message.enum";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";

@Injectable()
export class BooksService {
	constructor(
		@InjectRepository(BookEntity) private bookRepository: Repository<BookEntity>,
		@InjectRepository(BookCategorysEntity)
		private bookCategorysRepository: Repository<BookCategorysEntity>,
		@InjectRepository(BookEditorsEntity)
		private bookEditorsRepository: Repository<BookEditorsEntity>,
		@InjectRepository(BookPublishersEntity)
		private bookPublishersRepository: Repository<BookPublishersEntity>,
		@InjectRepository(BookTranslatorsEntity)
		private bookTranslatorsRepository: Repository<BookTranslatorsEntity>,
		@InjectRepository(BookWritersEntity)
		private bookWriterRepository: Repository<BookWritersEntity>,
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

		if (!files) {
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
		if (categoryId) await this.bookCategorysRepository.insert({ bookId: book.id, categoryId });
		if (editorId) await this.bookEditorsRepository.insert({ bookId: book.id, editorId });
		if (publisherId) await this.bookPublishersRepository.insert({ bookId: book.id, publisherId });
		if (writerId) await this.bookWriterRepository.insert({ bookId: book.id, writerId });
		if (translatorId)
			await this.bookTranslatorsRepository.insert({ bookId: book.id, translatorId });

		return { message: PublicMessage.CreatedBook };
	}

	async findAll(paginationDto: PaginationDto, queryDto: QueryDto) {
		const { sort, sort_feild } = queryDto;
		const { limit, page, skip } = paginationSolver(paginationDto);
		const [books, count] = await this.bookRepository.findAndCount({
			where: { status: "public" },
			relations: {
				images: true,
				writers: { writer: true },
				editors: { editor: true },
				categorys: { category: true },
				publishers: { publisher: true },
				translators: { translator: true },
			},
			select: {
				id: true,
				name: true,
				enName: true,
				type: true,
				rating: true,
				price: true,
				discount: true,
				status: true,
				is_active: true,
				yearOfPublication: true,
				images: {
					id: true,
					image: true,
				},
				writers: {
					id: true,
					writer: {
						id: true,
						name: true,
						enName: true,
						image: true,
					},
				},
				editors: {
					id: true,
					editor: {
						id: true,
						name: true,
						enName: true,
						image: true,
					},
				},
				publishers: {
					id: true,
					publisher: {
						id: true,
						name: true,
						enName: true,
						logo: true,
					},
				},
				translators: {
					id: true,
					translator: {
						id: true,
						name: true,
						enName: true,
						image: true,
					},
				},
				categorys: {
					id: true,
					category: {
						id: true,
						slug: true,
						title: true,
					},
				},
			},
			skip,
			take: limit,
			order: { id: "DESC" },
		});
		return { pagination: paginationGenerator(count, page, limit), books };
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
