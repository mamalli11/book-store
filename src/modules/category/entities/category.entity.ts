import { Entity, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";

import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { BookEntity } from "src/modules/books/entities/book.entity";

@Entity(EntityName.Category)
export class CategoryEntity extends BaseEntity {
	@Column({ length: 50 })
	title: string;

	@Column({ unique: true, length: 50 })
	slug: string;

	@Column({ nullable: true })
	image: string;

	@Column({ nullable: true })
	imageKey: string;

	@Column({ default: true })
	show: boolean;

	@Column({ nullable: true })
	parentId: number;
	@ManyToOne(() => CategoryEntity, (category) => category.children, { onDelete: "CASCADE" })
	parent: CategoryEntity;

	@OneToMany(() => CategoryEntity, (category) => category.parent)
	children: CategoryEntity[];

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@ManyToOne(() => BookEntity, (book) => book.category, { onDelete: "CASCADE" })
	book: BookEntity;
}
