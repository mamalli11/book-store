import { Column, CreateDateColumn, Entity, OneToMany, UpdateDateColumn } from "typeorm";

import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { BasketEntity } from "src/modules/basket/entities/basket.entity";

@Entity(EntityName.Discount)
export class DiscountEntity extends BaseEntity {
	@Column()
	code: string;

	@Column({ default: "percent", enum: ["fixed_amount", "percent"] })
	type: string;

	@Column()
	start_at: Date;

	@Column({ nullable: true })
	expires_in: Date;

	@Column({ type: "real", nullable: true })
	percent: number;

	@Column({ type: "real", nullable: true })
	amount: number;

	@Column({ nullable: true })
	limit: number;

	@Column({ nullable: true, default: 0 })
	usage: number;

	@Column({ default: true })
	active: boolean;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@OneToMany(() => BasketEntity, (basket) => basket.discount)
	baskets: BasketEntity[];
}
