import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";

import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { OrderEntity } from "src/modules/order/entities/order.entity";

@Entity(EntityName.Payment)
export class PaymentEntity extends BaseEntity {
	@Column({ default: false })
	status: boolean;
	@Column()
	amount: number;
	@Column()
	invoice_number: string;
	@Column({ nullable: true })
	authority: string;
	@Column()
	userId: number;
	@Column()
	orderId: number;
	@ManyToOne(() => OrderEntity, (order) => order.payments, { onDelete: "CASCADE" })
	order: OrderEntity;
	@ManyToOne(() => UserEntity, (user) => user.payments, { onDelete: "CASCADE" })
	user: UserEntity;
	@CreateDateColumn()
	created_at: Date;
}
