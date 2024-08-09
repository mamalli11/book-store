import { Column, CreateDateColumn, Entity, ManyToMany, UpdateDateColumn } from "typeorm";

import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { DefaultPath } from "src/common/enums/default-path.enum";
import { BookTranslatorsEntity } from "src/modules/books/entities/bookTranslators.entity";

@Entity(EntityName.Translator)
export class TranslatorEntity extends BaseEntity {
	@Column({ length: 50 })
	name: string;

	@Column({ length: 50 })
	enName: string;

	@Column({ default: DefaultPath.UserProfile })
	image: string;

	@Column({ nullable: true })
	imageKey: string;

	@Column({ length: 11, nullable: true })
	phone: string;

	@Column({ nullable: true })
	website: string;

	@Column({ nullable: true })
	email: string;

	@Column({ nullable: true })
	telegram: string;

	@Column({ nullable: true })
	instagram: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@ManyToMany(() => BookTranslatorsEntity, (book) => book.translator, { onDelete: "CASCADE" })
	book: BookTranslatorsEntity[];
}
