import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";

import { BookEntity } from "./book.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { WriterEntity } from "src/modules/writer/entities/writer.entity";

@Entity(EntityName.BookWriters)
export class BookWritersEntity extends BaseEntity {
	@Column()
	bookId: number;
	@ManyToOne(() => BookEntity, (book) => book.writers, { onDelete: "CASCADE" })
	book: BookEntity;

	@Column()
	writerId: number;
	@ManyToOne(() => WriterEntity, (writer) => writer.book, { onDelete: "CASCADE" })
	writer: WriterEntity;

	@CreateDateColumn()
	created_at: Date;
}
