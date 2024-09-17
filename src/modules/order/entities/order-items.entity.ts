import { Column, Entity, ManyToOne } from "typeorm";

import { OrderEntity } from "./order.entity";
import { OrderItemStatus } from "../enum/status.enum";
import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { BookEntity } from "src/modules/books/entities/book.entity";

@Entity(EntityName.OrderItem)
export class OrderItemEntity extends BaseEntity {
	@Column()
	bookId: number;

	@Column()
	orderId: number;

	@Column()
	count: number;

	@Column({ type: "enum", enum: OrderItemStatus, default: OrderItemStatus.Pending })
	status: string;

	@ManyToOne(() => BookEntity, (book) => book.orders, { onDelete: "CASCADE" })
	book: BookEntity;

	@ManyToOne(() => OrderEntity, (order) => order.items, { onDelete: "CASCADE" })
	order: OrderEntity;
}
