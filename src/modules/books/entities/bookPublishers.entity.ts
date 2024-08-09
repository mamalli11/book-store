import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";

import { BookEntity } from "./book.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { PublisherEntity } from "src/modules/publisher/entities/publisher.entity";

@Entity(EntityName.BookPublishers)
export class BookPublishersEntity extends BaseEntity {
	@Column()
	bookId: number;
	@ManyToOne(() => BookEntity, (book) => book.writers, { onDelete: "CASCADE" })
	book: BookEntity;

	@Column()
	publisherId: number;
	@ManyToOne(() => PublisherEntity, (publisher) => publisher.book, { onDelete: "CASCADE" })
	publisher: PublisherEntity;

	@CreateDateColumn()
	created_at: Date;
}
