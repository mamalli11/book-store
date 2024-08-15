import { Column, CreateDateColumn, Entity, ManyToMany, UpdateDateColumn } from "typeorm";

import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { BookPublishersEntity } from "src/modules/books/entities/bookPublishers.entity";

@Entity(EntityName.Publisher)
export class PublisherEntity extends BaseEntity {
	@Column({ length: 50 })
	name: string;

	@Column({ length: 50 })
	enName: string;

	@Column({})
	logo: string;

	@Column({})
	logoKey: string;

	@Column({})
	website: string;

	@Column({ length: 11 })
	work_phone: string;

	@Column({ nullable: true, length: 11 })
	phone: string;

	@Column({ nullable: true })
	address: string;

	@Column({ nullable: true })
	email: string;

	@Column({ nullable: true, length: 50 })
	instagram: string;

	@Column({ nullable: true, length: 50 })
	telegram: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@ManyToMany(() => BookPublishersEntity, (book) => book.publisher, { onDelete: "CASCADE" })
	book: BookPublishersEntity[];
}
