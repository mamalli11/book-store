import {
	Scope,
	Inject,
	Injectable,
	ConflictException,
	NotFoundException,
	BadRequestException,
} from "@nestjs/common";
import slugify from "slugify";
import { Request } from "express";
import { REQUEST } from "@nestjs/core";
import { DeepPartial, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { I18nService, I18nContext } from "nestjs-i18n";

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
import { BookBookmarkEntity } from "./entities/bookmark.entity";
import { PublisherService } from "../publisher/publisher.service";
import { BookWritersEntity } from "./entities/bookWriters.entity";
import { BookEditorsEntity } from "./entities/bookEditors.entity";
import { TranslatorService } from "../translator/translator.service";
import { BookCategorysEntity } from "./entities/bookCategory.entity";
import { BookWantToReadEntity } from "./entities/bookWantToRead.entity";
import { BookPublishersEntity } from "./entities/bookPublishers.entity";
import { PaginationDto, QueryDto } from "src/common/dtos/pagination.dto";
import { BookTranslatorsEntity } from "./entities/bookTranslators.entity";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";

@Injectable({ scope: Scope.REQUEST })
export class BooksService {
	constructor(
		@InjectRepository(BookEntity) private readonly bookRepository: Repository<BookEntity>,
		@InjectRepository(BookCategorysEntity)
		private readonly bookCategorysRepository: Repository<BookCategorysEntity>,
		@InjectRepository(BookEditorsEntity)
		private readonly bookEditorsRepository: Repository<BookEditorsEntity>,
		@InjectRepository(BookPublishersEntity)
		private readonly bookPublishersRepository: Repository<BookPublishersEntity>,
		@InjectRepository(BookTranslatorsEntity)
		private readonly bookTranslatorsRepository: Repository<BookTranslatorsEntity>,
		@InjectRepository(BookWritersEntity)
		private readonly bookWriterRepository: Repository<BookWritersEntity>,
		@InjectRepository(ImagesBookEntity)
		private readonly imagesBookRepository: Repository<ImagesBookEntity>,
		@InjectRepository(BookBookmarkEntity)
		private readonly bookBookmarkRepository: Repository<BookBookmarkEntity>,
		@InjectRepository(BookWantToReadEntity)
		private readonly wantToReadRepository: Repository<BookWantToReadEntity>,
		@Inject(REQUEST) private readonly request: Request,

		private readonly i18n: I18nService,
		private readonly s3Service: S3Service,
		private readonly editorService: EditorService,
		private readonly writerService: WriterService,
		private readonly categoryService: CategoryService,
		private readonly publisherService: PublisherService,
		private readonly translatorService: TranslatorService,
	) {}

	async create(createBookDto: CreateBookDto, files: BookImagesType) {
		const { slug } = createBookDto;

		await this.validateBookData(createBookDto);

		const book = await this.bookRepository.save(
			this.bookRepository.create({
				...createBookDto,
				slug: this.generateSlug(slug, createBookDto.name),
			}),
		);

		if (files) {
			await Promise.all(
				Object.keys(files).map(async (key) => {
					const imageResult = await this.s3Service.uploadFile(files[key][0], "books");
					await this.imagesBookRepository.save(
						this.imagesBookRepository.create({
							image: imageResult.Location,
							imageKey: imageResult.Key,
							bookId: book.id,
						}),
					);
				}),
			);
		}

		await this.insertRelations(createBookDto, book.id);

		return {
			message: this.i18n.t("tr.PublicMessage.CreatedBook", {
				lang: I18nContext.current().lang,
			}),
		};
	}

	private async validateBookData(createBookDto: CreateBookDto) {
		await this.checkExistSlug(createBookDto.slug?.trim().replaceAll(" ", "_") || null);

		// بررسی تخفیف
		if (createBookDto.discount && createBookDto.discount !== 0) {
			if (createBookDto.discount < 0 || createBookDto.discount > 100) {
				throw new BadRequestException(
					this.i18n.t("tr.BadRequestMessage.DiscountPercentageNotAllowed", {
						lang: I18nContext.current().lang,
					}),
				);
			}
		}
	}

	private generateSlug(slug: string, name: string) {
		return slug
			? slug.trim().replaceAll(" ", "_")
			: slugify(name, {
					replacement: "_",
					locale: "fa",
					trim: true,
				});
	}

	private async insertRelations(createBookDto: CreateBookDto, bookId: number) {
		const { categoryId, editorId, publisherId, writerId, translatorId } = createBookDto;

		await Promise.all([
			this.insertEntities(categoryId, this.bookCategorysRepository, bookId, "categoryId"),
			this.insertEntities(editorId, this.bookEditorsRepository, bookId, "editorId"),
			this.insertEntities(publisherId, this.bookPublishersRepository, bookId, "publisherId"),
			this.insertEntities(writerId, this.bookWriterRepository, bookId, "writerId"),
			this.insertEntities(translatorId, this.bookTranslatorsRepository, bookId, "translatorId"),
		]);
	}

	private async insertEntities(
		ids: string | string[],
		repository: Repository<any>,
		bookId: number,
		entityIdKey: string,
	) {
		if (typeof ids === "string") {
			ids = ids.split(",");
		}

		const entities = ids.map((id) => ({ bookId, [entityIdKey]: +id }));
		await repository.insert(entities);
	}

	async findAll(paginationDto: PaginationDto, queryDto: QueryDto) {
		const { sort, sort_feild } = queryDto;
		const { limit, page, skip } = paginationSolver(paginationDto);

		// کوئری بهینه‌شده برای بازیابی داده‌ها
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
				slug: true,
				type: true,
				rating: true,
				price: true,
				discount: true,
				status: true,
				is_active: true,
				yearOfPublication: true,
				images: { id: true, image: true },
				writers: {
					id: true,
					writer: { id: true, name: true, enName: true, image: true },
				},
				editors: {
					id: true,
					editor: { id: true, name: true, enName: true, image: true },
				},
				publishers: {
					id: true,
					publisher: { id: true, name: true, enName: true, logo: true },
				},
				translators: {
					id: true,
					translator: { id: true, name: true, enName: true, image: true },
				},
				categorys: {
					id: true,
					category: { id: true, slug: true, title: true },
				},
			},
			skip,
			take: limit,
			order: { [sort_feild || "id"]: sort || "DESC" }, // ترتیب مرتب‌سازی
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
				images: { id: true, image: true, imageKey: true },
				writers: { id: true, writer: { id: true, name: true, enName: true, image: true } },
				editors: { id: true, editor: { id: true, name: true, enName: true, image: true } },
				publishers: { id: true, publisher: { id: true, name: true, enName: true, logo: true } },
				translators: {
					id: true,
					translator: { id: true, name: true, enName: true, image: true },
				},
				categorys: { id: true, category: { id: true, slug: true, title: true } },
			},
		});

		if (!book) {
			throw new NotFoundException(
				this.i18n.t("tr.NotFoundMessage.NotFoundBook", {
					lang: I18nContext.current().lang,
				}),
			);
		}

		await this.bookRepository.update({ id }, { view: book.view + 1 });
		return book;
	}

	async update(id: number, updateBookDto: UpdateBookDto, files: BookImagesType) {
		const book = await this.findOne(id);
		const updateObject: DeepPartial<BookEntity> = {};
		const { editorId, writerId, categoryId, publisherId, translatorId } = updateBookDto;

		// بررسی وجود روابط
		await this.checkExistRelationship({
			editorId,
			writerId,
			categoryId,
			publisherId,
			translatorId,
		});

		if (files.media1) {
			if (book.images) {
				await Promise.all(
					book.images.map(async (image) => {
						await this.s3Service.deleteFile(image.imageKey);
						await this.imagesBookRepository.delete({ id: image.id });
					}),
				);
			}

			await Promise.all(
				Object.keys(files).map(async (k) => {
					const imageResult = await this.s3Service.uploadFile(files[k][0], "books");
					await this.imagesBookRepository.save(
						this.imagesBookRepository.create({
							image: imageResult.Location,
							imageKey: imageResult.Key,
							bookId: book.id,
						}),
					);
				}),
			);
		}

		if (updateBookDto.name) updateObject["name"] = updateBookDto.name;
		if (updateBookDto.enName) updateObject["enName"] = updateBookDto.enName;
		if (updateBookDto.slug) {
			const existingBook = await this.bookRepository.findOneBy({ slug: updateBookDto.slug });
			if (existingBook && existingBook.id !== id) {
				throw new ConflictException(
					this.i18n.t("tr.ConflictMessage.AlreadyExistBookSlug", {
						lang: I18nContext.current().lang,
					}),
				);
			}
			const name = updateBookDto.name || book.name;
			updateObject["slug"] = this.generateSlug(name, updateBookDto.slug);
		}
		if (updateBookDto.introduction) updateObject["introduction"] = updateBookDto.introduction;
		if (updateBookDto.ISBN) updateObject["ISBN"] = updateBookDto.ISBN;
		if (updateBookDto.shabak) updateObject["shabak"] = updateBookDto.shabak;
		if (updateBookDto.nbn) updateObject["nbn"] = updateBookDto.nbn;
		if (updateBookDto.stockCount) updateObject["stockCount"] = updateBookDto.stockCount;
		if (updateBookDto.price) updateObject["price"] = updateBookDto.price;
		if (updateBookDto.discount) updateObject["discount"] = updateBookDto.discount;
		if (updateBookDto.weightBook) updateObject["weightBook"] = updateBookDto.weightBook;
		if (updateBookDto.numberOfPage) updateObject["numberOfPage"] = updateBookDto.numberOfPage;
		if (updateBookDto.yearOfPublication)
			updateObject["yearOfPublication"] = updateBookDto.yearOfPublication;
		if (updateBookDto.bookCoverType) updateObject["bookCoverType"] = updateBookDto.bookCoverType;
		if (updateBookDto.type) updateObject["type"] = updateBookDto.type;
		if (updateBookDto.status) updateObject["status"] = updateBookDto.status;

		if (categoryId) {
			await this.bookCategorysRepository.delete(book.categorys.map((i) => i.id));
			await this.insertEntities(categoryId, this.bookCategorysRepository, book.id, "categoryId");
		}

		if (editorId) {
			await this.bookEditorsRepository.delete(book.editors.map((i) => i.id));
			await this.insertEntities(editorId, this.bookEditorsRepository, book.id, "editorId");
		}

		if (publisherId) {
			await this.bookPublishersRepository.delete(book.publishers.map((i) => i.id));
			await this.insertEntities(
				publisherId,
				this.bookPublishersRepository,
				book.id,
				"publisherId",
			);
		}

		if (writerId) {
			await this.bookWriterRepository.delete(book.writers.map((i) => i.id));
			await this.insertEntities(writerId, this.bookWriterRepository, book.id, "writerId");
		}

		if (translatorId) {
			await this.bookTranslatorsRepository.delete(book.translators.map((i) => i.id));
			await this.insertEntities(
				translatorId,
				this.bookTranslatorsRepository,
				book.id,
				"translatorId",
			);
		}

		await this.bookRepository.update({ id }, updateObject);
		return {
			message: this.i18n.t("tr.PublicMessage.Updated", {
				lang: I18nContext.current().lang,
			}),
		};
	}

	async remove(id: number) {
		const book = await this.bookRepository.findOne({
			where: { id },
			relations: { images: true },
		});

		if (book?.images?.length) {
			for (const image of book.images) {
				await this.s3Service.deleteFile(image.imageKey);
			}
		}

		await this.bookRepository.delete({ id });
		return {
			message: this.i18n.t("tr.PublicMessage.Deleted", {
				lang: I18nContext.current().lang,
			}),
		};
	}

	async checkExistBookById(id: number) {
		const book = await this.bookRepository.findOneBy({ id });
		if (!book) {
			throw new NotFoundException(
				this.i18n.t("tr.NotFoundMessage.NotFoundBook", {
					lang: I18nContext.current().lang,
				}),
			);
		}
		return book;
	}

	private async checkExistRelationship(relationShipType: RelationShipType) {
		const { categoryId, editorId, publisherId, writerId, translatorId } = relationShipType;

		const processIds = async (
			ids: string | string[],
			serviceMethod: (id: number) => Promise<any>,
		) => {
			if (typeof ids === "string") {
				ids = ids.split(",");
			}
			for (const id of ids) {
				await serviceMethod(+id);
			}
		};

		if (categoryId)
			await processIds(categoryId, this.categoryService.findOneById.bind(this.categoryService));
		if (editorId) await processIds(editorId, this.editorService.findOne.bind(this.editorService));
		if (publisherId)
			await processIds(publisherId, this.publisherService.findOne.bind(this.publisherService));
		if (writerId) await processIds(writerId, this.writerService.findOne.bind(this.writerService));
		if (translatorId)
			await processIds(
				translatorId,
				this.translatorService.findOne.bind(this.translatorService),
			);

		return true;
	}

	async checkExistSlug(slug: string) {
		const book = await this.bookRepository.findOneBy({ slug });
		if (book) {
			throw new ConflictException(
				this.i18n.t("tr.ConflictMessage.AlreadyExistBookSlug", {
					lang: I18nContext.current().lang,
				}),
			);
		}
	}

	async findOneBySlug(slug: string) {
		const book = await this.bookRepository.findOne({
			where: { slug },
			relations: ["images", "writers", "editors", "categorys", "publishers", "translators"],
		});

		if (!book) {
			throw new NotFoundException(
				this.i18n.t("tr.NotFoundMessage.NotFoundBookSlug", {
					lang: I18nContext.current().lang,
				}),
			);
		}

		await this.bookRepository.update({ id: book.id }, { view: book.view + 1 });
		return book;
	}

	async bookmarkToggle(bookId: number) {
		const userId = this.request.user.id;
		await this.checkExistBookById(bookId);

		const bookmark = await this.bookBookmarkRepository.findOneBy({ userId, bookId });
		let message = this.i18n.t("tr.PublicMessage.Bookmark", { lang: I18nContext.current().lang });

		if (bookmark) {
			await this.bookBookmarkRepository.delete({ id: bookmark.id });
			message = this.i18n.t("tr.PublicMessage.UnBookmark", { lang: I18nContext.current().lang });
		} else {
			await this.bookBookmarkRepository.insert({ bookId, userId });
		}

		return { message };
	}

	async wantToReadToggle(bookId: number) {
		const userId = this.request.user.id;
		await this.checkExistBookById(bookId);

		const wtr = await this.wantToReadRepository.findOneBy({ userId, bookId });
		let message = this.i18n.t("tr.PublicMessage.Wtr", { lang: I18nContext.current().lang });

		if (wtr) {
			await this.wantToReadRepository.delete({ id: wtr.id });
			message = this.i18n.t("tr.PublicMessage.UnWtr", { lang: I18nContext.current().lang });
		} else {
			await this.wantToReadRepository.insert({ bookId, userId });
		}

		return { message };
	}

	async findAllBookmark(paginationDto: PaginationDto) {
		const userId = this.request.user.id;
		const { limit, page, skip } = paginationSolver(paginationDto);

		const [bookmarks, count] = await this.bookBookmarkRepository.findAndCount({
			where: { userId },
			relations: ["book", "book.images"],
			skip,
			take: limit,
			order: { id: "DESC" },
		});

		return { pagination: paginationGenerator(count, page, limit), bookmarks };
	}

	async findAllWantToRead(paginationDto: PaginationDto) {
		const userId = this.request.user.id;
		const { limit, page, skip } = paginationSolver(paginationDto);

		const [wtrs, count] = await this.wantToReadRepository.findAndCount({
			where: { userId },
			relations: ["book", "book.images"],
			skip,
			take: limit,
			order: { id: "DESC" },
		});

		return { pagination: paginationGenerator(count, page, limit), wtrs };
	}

	async decrementStockCount(id: number) {
		const book = await this.bookRepository.findOneBy({ id });
		if (!book) {
			throw new NotFoundException(
				this.i18n.t("tr.NotFoundMessage.NotFoundBook", {
					lang: I18nContext.current().lang,
				}),
			);
		}

		book.stockCount -= 1;
		if (book.stockCount <= 0) {
			book.is_active = false;
			book.status = "endOfInventory";
		}

		await this.bookRepository.save(book);
	}

	async getOne(id: number) {
		const book = await this.bookRepository.findOne({ where: { id, is_active: true } });
		if (!book)
			throw new BadRequestException(
				this.i18n.t("tr.BadRequestMessage.OutOfStockOrInactive", {
					lang: I18nContext.current().lang,
				}),
			);
		return book;
	}
}
