import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";

import { BookEntity } from "./entities/book.entity";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { NotFoundMessage } from "src/common/enums/message.enum";

@Injectable()
export class BooksService {
	constructor(@InjectRepository(BookEntity) private bookRepository: Repository<BookEntity>) {}
	create(createBookDto: CreateBookDto) {
		return "This action adds a new book";
	}

	findAll() {
		return `This action returns all books`;
	}

	findOne(id: number) {
		return `This action returns a #${id} book`;
	}

	update(id: number, updateBookDto: UpdateBookDto) {
		return `This action updates a #${id} book`;
	}

	remove(id: number) {
		return `This action removes a #${id} book`;
	}
	async checkExistBlogById(id: number) {
		const book = await this.bookRepository.findOneBy({ id });
		if (!book) throw new NotFoundException(NotFoundMessage.NotFoundBook);
		return book;
	}
}
