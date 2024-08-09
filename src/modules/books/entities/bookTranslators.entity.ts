import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";

import { BookEntity } from "./book.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { TranslatorEntity } from "src/modules/translator/entities/translator.entity";

@Entity(EntityName.BookTranslators)
export class BookTranslatorsEntity extends BaseEntity {
	@Column()
	bookId: number;
	@ManyToOne(() => BookEntity, (book) => book.writers, { onDelete: "CASCADE" })
	book: BookEntity;

	@Column()
	translatorId: number;
	@ManyToOne(() => TranslatorEntity, (translator) => translator.book, { onDelete: "CASCADE" })
	translator: TranslatorEntity;

	@CreateDateColumn()
	created_at: Date;
}
