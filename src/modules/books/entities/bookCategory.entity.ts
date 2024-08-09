import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";

import { BookEntity } from "./book.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { CategoryEntity } from "src/modules/category/entities/category.entity";

@Entity(EntityName.BookCategorys)
export class BookCategorysEntity extends BaseEntity {
	@Column()
	bookId: number;
	@ManyToOne(() => BookEntity, (book) => book.writers, { onDelete: "CASCADE" })
	book: BookEntity;

	@Column()
	categoryId: number;
	@ManyToOne(() => CategoryEntity, (category) => category.books, { onDelete: "CASCADE" })
	category: CategoryEntity;

	@CreateDateColumn()
	created_at: Date;
}
