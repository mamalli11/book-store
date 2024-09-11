import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany } from "typeorm";

import { UserEntity } from "./user.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { OrderEntity } from "src/modules/order/entities/order.entity";

@Entity(EntityName.UserAddress)
export class UserAddressEntity extends BaseEntity {
	@Column()
	title: string;
	@Column()
	province: string;
	@Column()
	city: string;
	@Column()
	address: string;
	@Column({ nullable: true })
	postal_code: string;
	@Column()
	userId: number;
	@CreateDateColumn()
	created_at: Date;
	@ManyToOne(() => UserEntity, (user) => user.addressList, { onDelete: "CASCADE" })
	user: UserEntity;
	@OneToMany(() => OrderEntity, (order) => order.address)
	orders: OrderEntity[];
}
