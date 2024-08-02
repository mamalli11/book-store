import { Column, CreateDateColumn, Entity, OneToMany, UpdateDateColumn } from "typeorm";

import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { BasketEntity } from "src/modules/basket/entities/basket.entity";

@Entity(EntityName.Books)
export class BookEntity extends BaseEntity {
	@Column({ length: 150 })
	name: string;

	@Column({ length: 150 })
	enName: string;

	@Column({})
	introduction: string;

	@Column({})
	ISBN: number;

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

	@Column({ default: 0, type: "float" })
	weightBook: number;

	@Column({
		default: "شُمیز",
		enum: ["شُمیز", "کاغذی", "گالینگور", "سخت", "چرمی", "پارچه ای", "لبه گردان", "زر کوب"],
	})
	bookCoverType: string;

	@Column({ default: 1 })
	numberOfPage: number;

	@Column({ length: 4 })
	yearOfPublication: string;

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
	writerId: string;

	@Column({ nullable: true })
	translatorId: string;

	@Column({})
	publisherId: string;

	@Column({ nullable: true })
	editorId: string;

	@Column({})
	imagesId: string;

	@Column({})
	categoryId: string;

	@Column({})
	commentsId: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@OneToMany(() => BasketEntity, (basket) => basket.book)
	baskets: BasketEntity[];
}
