import { Entity, Column, CreateDateColumn } from "typeorm";

import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";

@Entity(EntityName.FrequentSearch)
export class FrequentSearchEntity extends BaseEntity {
	@Column()
	query: string;

	@Column({ default: 0 })
	searchCount: number;

	@CreateDateColumn()
	createdAt: Date;
}
