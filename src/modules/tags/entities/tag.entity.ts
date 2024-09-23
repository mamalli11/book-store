import { Column, CreateDateColumn, Entity, OneToMany } from "typeorm";

import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { BookTagsEntity } from "src/modules/books/entities/bookTags.entity";

@Entity(EntityName.Tags)
export class TagsEntity extends BaseEntity {
	@Column()
	name: string;

	@CreateDateColumn()
	createdAt: Date;

	@OneToMany(() => BookTagsEntity, (book) => book.tag)
	books: BookTagsEntity[];
}
