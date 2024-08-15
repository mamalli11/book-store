import { Column, CreateDateColumn, Entity, OneToMany, UpdateDateColumn } from "typeorm";

import { ImagesBookEntity } from "./images.entity";
import { BookEditorsEntity } from "./bookEditors.entity";
import { BookWritersEntity } from "./bookWriters.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { BookCategorysEntity } from "./bookCategory.entity";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { BookPublishersEntity } from "./bookPublishers.entity";
import { BookTranslatorsEntity } from "./bookTranslators.entity";
import { BasketEntity } from "src/modules/basket/entities/basket.entity";
import { CommentEntity } from "src/modules/comments/entities/comment.entity";

@Entity(EntityName.Books)
export class BookEntity extends BaseEntity {
	@Column({ length: 150 })
	name: string;

	@Column({ length: 150 })
	enName: string;

	@Column({ unique: true, length: 60 })
	slug: string;

	@Column({})
	introduction: string;

	@Column({})
	ISBN: string;

	@Column({ length: 15 })
	shabak: string;

	@Column({ length: 8, comment: "National Bibliography Number" })
	nbn: string;

	@Column({ default: 0 })
	stockCount: number;

	@Column({})
	price: number;

	@Column({ default: 0 })
	discount: number;

	@Column({ default: 0, type: "float" })
	rating: number;

	@Column({ default: "0" })
	weightBook: string;

	@Column({
		default: "شُمیز",
		enum: ["شُمیز", "کاغذی", "گالینگور", "سخت", "چرمی", "پارچه ای", "لبه گردان", "زر کوب"],
	})
	bookCoverType: string;

	@Column({ default: 1 })
	numberOfPage: number;

	@Column({})
	yearOfPublication: number;

	@Column({ default: "book", enum: ["e-book", "book", "journal"] })
	type: string;

	@Column({
		default: "public",
		enum: ["public", "hidden", "archive", "soldout", "endOfInventory"],
	})
	status: string;

	@Column({ default: true })
	is_active: boolean;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@OneToMany(() => BasketEntity, (basket) => basket.book)
	baskets: BasketEntity[];

	@OneToMany(() => CommentEntity, (comment) => comment.book)
	comments: CommentEntity[];

	@OneToMany(() => ImagesBookEntity, (image) => image.book)
	images: ImagesBookEntity[];

	@OneToMany(() => BookCategorysEntity, (cat) => cat.book)
	categorys: BookCategorysEntity[];

	@OneToMany(() => BookEditorsEntity, (editor) => editor.book)
	editors: BookEditorsEntity[];

	@OneToMany(() => BookPublishersEntity, (publisher) => publisher.book)
	publishers: BookPublishersEntity[];

	@OneToMany(() => BookTranslatorsEntity, (translator) => translator.book)
	translators: BookTranslatorsEntity[];

	@OneToMany(() => BookWritersEntity, (writer) => writer.book)
	writers: BookWritersEntity[];
}
