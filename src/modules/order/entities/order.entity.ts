import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

import { OrderStatus } from "../enum/status.enum";
import { OrderItemEntity } from "./order-items.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { PaymentEntity } from "src/modules/payment/entities/payment.entity";
import { UserAddressEntity } from "src/modules/user/entities/address.entity";

@Entity(EntityName.Order)
export class OrderEntity extends BaseEntity {
	@Column()
	userId: number;
	@Column({ nullable: true })
	addressId: number;
	@Column()
	payment_amount: number;
	@Column()
	discount_amount: number;
	@Column()
	total_amount: number;
	@Column({ type: "enum", enum: OrderStatus, default: OrderStatus.Pending })
	status: string;
	@Column({ nullable: true })
	description: string;
	@ManyToOne(() => UserEntity, (user) => user.orders, { onDelete: "CASCADE" })
	user: UserEntity;
	@ManyToOne(() => UserAddressEntity, (address) => address.orders, { onDelete: "SET NULL" })
	address: UserAddressEntity;
	@OneToMany(() => OrderItemEntity, (item) => item.order)
	items: OrderItemEntity[];
	@OneToMany(() => PaymentEntity, (payment) => payment.order)
	payments: PaymentEntity[];
}
