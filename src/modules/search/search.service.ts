import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { BookEntity } from "../books/entities/book.entity";
import { WriterEntity } from "../writer/entities/writer.entity";
import { EditorEntity } from "../editor/entities/editor.entity";
import { PublisherEntity } from "../publisher/entities/publisher.entity";
import { TranslatorEntity } from "../translator/entities/translator.entity";
import { SearchDto } from "./dto/search.dto";

@Injectable()
export class SearchService {
	constructor(
		@InjectRepository(BookEntity)
		private readonly bookRepository: Repository<BookEntity>,

		@InjectRepository(WriterEntity)
		private readonly writerRepository: Repository<WriterEntity>,

		@InjectRepository(PublisherEntity)
		private readonly publisherRepository: Repository<PublisherEntity>,

		@InjectRepository(EditorEntity)
		private readonly editorRepository: Repository<EditorEntity>,

		@InjectRepository(TranslatorEntity)
		private readonly translatorRepository: Repository<TranslatorEntity>,
	) {}

	async search(query: string) {
		const books = await this.bookRepository
			.createQueryBuilder("book")
			.select(["book.id", "book.name", "book.enName", "book.slug"])
			.leftJoinAndSelect("book.images", "images") // استفاده از leftJoinAndSelect برای رابطه تصاویر
			.where("book.name ILIKE :query", { query: `%${query}%` })
			.orWhere("book.enName ILIKE :query", { query: `%${query}%` })
			.orWhere("book.slug ILIKE :query", { query: `%${query}%` })
			.getMany();

		const writers = await this.writerRepository
			.createQueryBuilder("writer")
			.select(["writer.id", "writer.name", "writer.enName"])
			.where("writer.name ILIKE :query", { query: `%${query}%` })
			.orWhere("writer.enName ILIKE :query", { query: `%${query}%` })
			.getMany();

		const publishers = await this.publisherRepository
			.createQueryBuilder("publisher")
			.select(["publisher.id", "publisher.name", "publisher.enName"])
			.where("publisher.name ILIKE :query", { query: `%${query}%` })
			.orWhere("publisher.enName ILIKE :query", { query: `%${query}%` })
			.getMany();

		const editors = await this.editorRepository
			.createQueryBuilder("editor")
			.select(["editor.id", "editor.name", "editor.enName"])
			.where("editor.name ILIKE :query", { query: `%${query}%` })
			.orWhere("editor.enName ILIKE :query", { query: `%${query}%` })
			.getMany();

		const translators = await this.translatorRepository
			.createQueryBuilder("translator")
			.select(["translator.id", "translator.name", "translator.enName"])
			.where("translator.name ILIKE :query", { query: `%${query}%` })
			.orWhere("translator.enName ILIKE :query", { query: `%${query}%` })
			.getMany();

		return {
			books: books.map((book) => ({
				id: book.id,
				name: book.name,
				enName: book.enName,
				slug: book.slug,
				image: book.images,
			})),
			writers,
			publishers,
			editors,
			translators,
		};
	}

	async advancedSearch(searchDto: SearchDto) {
		const { filters, query, order, page, sortBy, pageSize } = searchDto;

		// ساخت شرایط جستجو و پارامترها
		const searchConditions = this.getSearchConditions("book", query);
		const searchParams = this.getQueryParams(query);

		// جستجوی کتاب‌ها
		const booksQuery = this.bookRepository
			.createQueryBuilder("book")
			.leftJoinAndSelect("book.images", "images")
			.addSelect(["book.id", "book.name", "book.enName", "book.slug"])
			.where(searchConditions, searchParams)
			.andWhere(this.getFilters("book", filters))
			.orderBy(sortBy ? `book.${sortBy}` : "book.created_at", order)
			.skip((page - 1) * pageSize)
			.take(pageSize);

		const books = await booksQuery.getMany();

		// جستجوی نویسندگان
		const writersQuery = this.writerRepository
			.createQueryBuilder("writer")
			.addSelect(["writer.id", "writer.name", "writer.enName"])
			.where(this.getSearchConditions("writer", query))
			.andWhere(this.getFilters("writer", filters))
			.orderBy(sortBy ? `writer.${sortBy}` : "writer.created_at", order)
			.skip((page - 1) * pageSize)
			.take(pageSize);

		const writers = await writersQuery.getMany();

		// جستجوی ناشران
		const publishersQuery = this.publisherRepository
			.createQueryBuilder("publisher")
			.addSelect(["publisher.id", "publisher.name", "publisher.enName"])
			.where(this.getSearchConditions("publisher", query))
			.andWhere(this.getFilters("publisher", filters))
			.orderBy(sortBy ? `publisher.${sortBy}` : "publisher.created_at", order)
			.skip((page - 1) * pageSize)
			.take(pageSize);

		const publishers = await publishersQuery.getMany();

		// جستجوی ویراستاران
		const editorsQuery = this.editorRepository
			.createQueryBuilder("editor")
			.addSelect(["editor.id", "editor.name", "editor.enName"])
			.where(this.getSearchConditions("editor", query))
			.andWhere(this.getFilters("editor", filters))
			.orderBy(sortBy ? `editor.${sortBy}` : "editor.created_at", order)
			.skip((page - 1) * pageSize)
			.take(pageSize);

		const editors = await editorsQuery.getMany();

		// جستجوی مترجمان
		const translatorsQuery = this.translatorRepository
			.createQueryBuilder("translator")
			.addSelect(["translator.id", "translator.name", "translator.enName"])
			.where(this.getSearchConditions("translator", query))
			.andWhere(this.getFilters("translator", filters))
			.orderBy(sortBy ? `translator.${sortBy}` : "translator.created_at", order)
			.skip((page - 1) * pageSize)
			.take(pageSize);

		const translators = await translatorsQuery.getMany();

		return {
			books: books.map((book) => ({
				id: book.id,
				name: book.name,
				enName: book.enName,
				image: book.images, // این قسمت بسته به ساختار فیلد image باید بررسی شود
			})),
			writers,
			publishers,
			editors,
			translators,
		};
	}

	// ساخت شرایط جستجو
	private getSearchConditions(alias: string, query: string): string {
		const words = query.split(" ");
		return words
			.map(
				(word, index) =>
					`(${alias}.name ILIKE :query${index} OR ${alias}.enName ILIKE :query${index}` +
					(alias === "book" ? ` OR ${alias}.slug ILIKE :query${index}` : "") +
					`)`,
			)
			.join(" AND ");
	}

	// مقداردهی به پارامترهای جستجو
	private getQueryParams(query: string): any {
		const words = query.split(" ");
		const params = {};

		words.forEach((word, index) => {
			params[`query${index}`] = `%${word}%`;
		});
		return params;
	}

	private getFilters(alias: string, filters: any) {
		const filterConditions = [];
		if (filters?.status) {
			filterConditions.push(`${alias}.status = :status`);
		}
		if (filters?.type) {
			filterConditions.push(`${alias}.type = :type`);
		}
		if (filters?.yearRange) {
			filterConditions.push(`${alias}.yearOfPublication BETWEEN :startYear AND :endYear`);
		}
		return filterConditions.length > 0 ? filterConditions.join(" AND ") : "1=1";
	}
}
