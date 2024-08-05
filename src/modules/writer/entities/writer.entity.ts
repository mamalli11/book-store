import { Column, CreateDateColumn, Entity, ManyToOne, UpdateDateColumn } from "typeorm";

import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { DefaultPath } from "src/common/enums/default-path.enum";
import { BookEntity } from "src/modules/books/entities/book.entity";

@Entity(EntityName.Writer)
export class WriterEntity extends BaseEntity {
	@Column({ length: 50 })
	name: string;

	@Column({ length: 50 })
	enName: string;

	@Column({ default: DefaultPath.UserProfile })
	image: string;

	@Column({ nullable: true })
	imageKey: string;

	@Column({ length: 200 })
	bio: string;

	@Column({ nullable: true })
	birthday: Date;

	@Column({ nullable: true })
	email: string;

	@Column({ nullable: true })
	phone: string;

	@Column({ nullable: true })
	instagram: string;

	@Column({ nullable: true })
	telegram: string;

	@Column({ nullable: true })
	website: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@ManyToOne(() => BookEntity, (book) => book.writer, { onDelete: "CASCADE" })
	book: BookEntity;
}
