import { Column, CreateDateColumn, Entity, OneToMany, UpdateDateColumn } from "typeorm";

import { ImagesBookEntity } from "./images.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { BasketEntity } from "src/modules/basket/entities/basket.entity";
import { CommentEntity } from "src/modules/comments/entities/comment.entity";
import { CategoryEntity } from "src/modules/category/entities/category.entity";
import { EditorEntity } from "src/modules/editor/entities/editor.entity";
import { PublisherEntity } from "src/modules/publisher/entities/publisher.entity";
import { TranslatorEntity } from "src/modules/translator/entities/translator.entity";
import { WriterEntity } from "src/modules/writer/entities/writer.entity";

@Entity(EntityName.Books)
export class BookEntity extends BaseEntity {
	@Column({ length: 150 })
	name: string;

	@Column({ length: 150 })
	enName: string;

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

	@Column({})
	writerId: number;

	@Column({ nullable: true })
	translatorId: number;

	@Column({})
	publisherId: number;

	@Column({ nullable: true })
	editorId: number;

	@Column({})
	categoryId: number;

	@Column({ nullable: true })
	commentsId: number;

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

	@OneToMany(() => CategoryEntity, (cat) => cat.id)
	category: CategoryEntity[];

	@OneToMany(() => EditorEntity, (editor) => editor.book)
	editor: EditorEntity[];

	@OneToMany(() => PublisherEntity, (publisher) => publisher.book)
	publisher: PublisherEntity[];

	@OneToMany(() => TranslatorEntity, (translator) => translator.book)
	translator: TranslatorEntity[];

	@OneToMany(() => WriterEntity, (writer) => writer.book)
	writer: WriterEntity[];
}
