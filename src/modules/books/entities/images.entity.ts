import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";

import { BookEntity } from "./book.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";

@Entity(EntityName.ImagesBook)
export class ImagesBookEntity extends BaseEntity {
	@Column()
	image: string;

	@Column({ nullable: true })
	imageKey: string;

	@Column()
	bookId: number;
	@ManyToOne(() => BookEntity, (book) => book.images, { onDelete: "CASCADE" })
	book: BookEntity;

	@CreateDateColumn()
	created_at: Date;
}
