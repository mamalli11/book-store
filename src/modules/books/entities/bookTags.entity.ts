import { Entity, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";

import { TagsEntity } from "src/modules/tags/entities/tag.entity";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { BookEntity } from "./book.entity";

@Entity(EntityName.BookTags)
export class BookTagsEntity extends BaseEntity {
	@Column()
	bookId: number;

	@Column()
	tagId: number;

	@CreateDateColumn()
	created_at: Date;

	@JoinColumn({ name: "tagId" })
	@ManyToOne(() => TagsEntity, (tag) => tag.books, { onDelete: "CASCADE" })
	tag: TagsEntity;

	@JoinColumn({ name: "bookId" })
	@ManyToOne(() => BookEntity, (book) => book.tags, { onDelete: "CASCADE" })
	book: BookEntity;
}
