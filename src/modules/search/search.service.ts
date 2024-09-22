import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { SearchDto } from "./dto/search.dto";
import { BookEntity } from "../books/entities/book.entity";
import { WriterEntity } from "../writer/entities/writer.entity";
import { EditorEntity } from "../editor/entities/editor.entity";
import { PublisherEntity } from "../publisher/entities/publisher.entity";
import { FrequentSearchEntity } from "./entities/FrequentSearches.entity";
import { TranslatorEntity } from "../translator/entities/translator.entity";

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

		@InjectRepository(FrequentSearchEntity)
		private readonly frequentSearchRepository: Repository<FrequentSearchEntity>,
	) {}

	async search(query: string) {
		const books = await this.bookRepository
			.createQueryBuilder("book")
			.select(["book.id", "book.name", "book.enName", "book.slug"])
			.leftJoinAndSelect("book.images", "images")
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
		const { query } = searchDto;
		let frequentSearch = await this.frequentSearchRepository.findOne({ where: { query } });

		if (frequentSearch) {
			frequentSearch.searchCount++;
			await this.frequentSearchRepository.save(frequentSearch);
		} else {
			frequentSearch = this.frequentSearchRepository.create({ query, searchCount: 1 });
			await this.frequentSearchRepository.save(frequentSearch);
		}

		const books = await this.searchBooks(searchDto);
		const writers = await this.searchWriters(searchDto);
		const publishers = await this.searchPublishers(searchDto);
		const editors = await this.searchEditors(searchDto);
		const translators = await this.searchTranslators(searchDto);

		return {
			books,
			writers,
			editors,
			publishers,
			translators,
		};
	}

	private async searchBooks(searchDto: SearchDto) {
		const { query, filters, page, pageSize, sortBy, order } = searchDto;

		const searchConditions = this.getSearchConditions("book", query);
		const searchParams = this.getQueryParams(query);

		const booksQuery = this.bookRepository
			.createQueryBuilder("book")
			.leftJoinAndSelect("book.images", "images")
			.select([
				"book.id",
				"book.name",
				"book.enName",
				"book.slug",
				"images.image",
				"book.created_at",
			])
			.where(searchConditions, searchParams)
			.andWhere(this.getFilters("book", filters))
			.orderBy(sortBy ? `book.${sortBy}` : "book.created_at", order || "DESC")
			.skip((page - 1) * pageSize)
			.take(pageSize);

		return await booksQuery.getMany();
	}

	private async searchWriters(searchDto: SearchDto) {
		const { query, filters, page, pageSize, sortBy, order } = searchDto;

		const searchParams = this.getQueryParams(query);

		const writersQuery = this.writerRepository
			.createQueryBuilder("writer")
			.select(["writer.id", "writer.name", "writer.enName", "writer.created_at"])
			.where(this.getSearchConditions("writer", query), searchParams)
			.andWhere(this.getFilters("writer", filters))
			.orderBy(sortBy ? `writer.${sortBy}` : "writer.created_at", order || "DESC")
			.skip((page - 1) * pageSize)
			.take(pageSize);

		return await writersQuery.getMany();
	}

	private async searchPublishers(searchDto: SearchDto) {
		const { query, filters, page, pageSize, sortBy, order } = searchDto;

		const searchParams = this.getQueryParams(query);

		const publishersQuery = this.publisherRepository
			.createQueryBuilder("publisher")
			.select(["publisher.id", "publisher.name", "publisher.enName", "publisher.created_at"])
			.where(this.getSearchConditions("publisher", query), searchParams)
			.andWhere(this.getFilters("publisher", filters))
			.orderBy(sortBy ? `publisher.${sortBy}` : "publisher.created_at", order || "DESC")
			.skip((page - 1) * pageSize)
			.take(pageSize);

		return await publishersQuery.getMany();
	}

	private async searchEditors(searchDto: SearchDto) {
		const { query, filters, page, pageSize, sortBy, order } = searchDto;

		const searchParams = this.getQueryParams(query);

		const editorsQuery = this.editorRepository
			.createQueryBuilder("editor")
			.select(["editor.id", "editor.name", "editor.enName", "editor.created_at"])
			.where(this.getSearchConditions("editor", query), searchParams)
			.andWhere(this.getFilters("editor", filters))
			.orderBy(sortBy ? `editor.${sortBy}` : "editor.created_at", order || "DESC")
			.skip((page - 1) * pageSize)
			.take(pageSize);

		return await editorsQuery.getMany();
	}

	private async searchTranslators(searchDto: SearchDto) {
		const { query, filters, page, pageSize, sortBy, order } = searchDto;

		const searchParams = this.getQueryParams(query);

		const translatorsQuery = this.translatorRepository
			.createQueryBuilder("translator")
			.select(["translator.id", "translator.name", "translator.enName", "translator.created_at"])
			.where(this.getSearchConditions("translator", query), searchParams)
			.andWhere(this.getFilters("translator", filters))
			.orderBy(sortBy ? `translator.${sortBy}` : "translator.created_at", order || "DESC")
			.skip((page - 1) * pageSize)
			.take(pageSize);

		return await translatorsQuery.getMany();
	}

	private getSearchConditions(alias: string, query: string): string {
		const words = query.split(" ");
		return words
			.map(
				(word, index) =>
					`(${alias}.name ILIKE :query${index} OR ${alias}.enName ILIKE :query${index} )`,
			)
			.join(" AND ");
	}

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
