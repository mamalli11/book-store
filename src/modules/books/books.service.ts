import { Repository } from "typeorm";
import { isArray } from "class-validator";
import { InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

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
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";
import { BadRequestMessage, NotFoundMessage, PublicMessage } from "src/common/enums/message.enum";

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

		if (categoryId) {
			await this.insertEntities(categoryId, this.bookCategorysRepository, book.id, "categoryId");
		}

		if (editorId) {
			await this.insertEntities(editorId, this.bookEditorsRepository, book.id, "editorId");
		}

		if (publisherId) {
			await this.insertEntities(
				publisherId,
				this.bookPublishersRepository,
				book.id,
				"publisherId",
			);
		}

		if (writerId) {
			await this.insertEntities(writerId, this.bookWriterRepository, book.id, "writerId");
		}

		if (translatorId) {
			await this.insertEntities(
				translatorId,
				this.bookTranslatorsRepository,
				book.id,
				"translatorId",
			);
		}

		return { message: PublicMessage.CreatedBook };
	}

	private async insertEntities(
		ids: string | string[],
		repository: any,
		bookId: number,
		entityIdKey: string,
	) {
		if (typeof ids === "string") {
			ids = ids.split(",");
			console.log({ ids });
		}
		for (const id of ids) {
			const entity = { bookId, [entityIdKey]: +id };
			await repository.insert(entity);
		}
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
		const book = await this.bookRepository.findOne({
			where: { id },
			relations: {
				images: true,
				writers: { writer: true },
				editors: { editor: true },
				categorys: { category: true },
				publishers: { publisher: true },
				translators: { translator: true },
			},
			select: {
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
		});
		if (!book) throw new NotFoundException(NotFoundMessage.NotFoundBook);
		return book;
	}

	async update(id: number, updateBookDto: UpdateBookDto) {
		return `This action updates a #${id} book`;
	}

	async remove(id: number) {
		const { images } = await this.bookRepository.findOne({
			where: { id },
			relations: { images: true },
		});

		if (images) {
			Object.keys(images).map(async (k) => {
				await this.s3Service.deleteFile(images[k].imageKey);
			});
		}

		await this.bookRepository.delete({ id });
		return { message: PublicMessage.Deleted };
	}

	async checkExistBlogById(id: number) {
		const book = await this.bookRepository.findOneBy({ id });
		if (!book) throw new NotFoundException(NotFoundMessage.NotFoundBook);
		return book;
	}

	private async checkExistRelationship(relationShipType: RelationShipType) {
		const { categoryId, editorId, publisherId, writerId, translatorId } = relationShipType;

		const processIds = async (
			ids: string | string[],
			serviceMethod: (id: number) => Promise<any>,
		) => {
			if (!isArray(ids) && typeof ids === "string") {
				ids = ids.split(",");
			} else if (!isArray(ids)) {
				throw new BadRequestException(BadRequestMessage.InvalidCategories);
			}
			for (const id of ids) {
				await serviceMethod(+id);
			}
		};

		if (categoryId) {
			await processIds(categoryId, this.categoryService.findOneById.bind(this.categoryService));
		}

		if (editorId) {
			await processIds(editorId, this.editorService.findOne.bind(this.editorService));
		}

		if (publisherId) {
			await processIds(publisherId, this.publisherService.findOne.bind(this.publisherService));
		}

		if (writerId) {
			await processIds(writerId, this.writerService.findOne.bind(this.writerService));
		}

		if (translatorId) {
			await processIds(
				translatorId,
				this.translatorService.findOne.bind(this.translatorService),
			);
		}

		return true;
	}
}
