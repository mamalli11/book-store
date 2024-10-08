import {
	Entity,
	Column,
	OneToMany,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToMany,
} from "typeorm";

import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { BookCategorysEntity } from "src/modules/books/entities/bookCategory.entity";

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

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@ManyToOne(() => CategoryEntity, (category) => category.children, { onDelete: "CASCADE" })
	parent: CategoryEntity;

	@OneToMany(() => CategoryEntity, (category) => category.parent)
	children: CategoryEntity[];

	@ManyToMany(() => BookCategorysEntity, (book) => book.category, { onDelete: "CASCADE" })
	books: BookCategorysEntity[];
}
