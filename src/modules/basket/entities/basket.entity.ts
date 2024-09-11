import { Column, Entity, ManyToOne } from "typeorm";

import { EntityName } from "src/common/enums/entity.enum";
import { BasketDiscountType } from "../enum/discount-type";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { BookEntity } from "src/modules/books/entities/book.entity";
import { DiscountEntity } from "src/modules/discount/entities/discount.entity";

@Entity(EntityName.Basket)
export class BasketEntity extends BaseEntity {
	@Column({ nullable: true })
	bookId: number;

	@Column()
	userId: number;

	@Column({ default: 1 })
	count: number;

	@Column({ default: true })
	is_active: boolean;

	@Column({ enum: BasketDiscountType, type: "enum", nullable: true })
	type: string;

	@Column({ nullable: true })
	discountId: number;

	@ManyToOne(() => BookEntity, (book) => book.baskets, { onDelete: "CASCADE" })
	book: BookEntity;

	@ManyToOne(() => UserEntity, (user) => user.basket, { onDelete: "CASCADE" })
	user: UserEntity;

	@ManyToOne(() => DiscountEntity, (discount) => discount.baskets, { onDelete: "CASCADE" })
	discount: DiscountEntity;
}
