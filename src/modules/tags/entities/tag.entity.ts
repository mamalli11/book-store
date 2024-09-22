import { Column, CreateDateColumn, Entity } from "typeorm";

import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";

@Entity(EntityName.Tags)
export class TagsEntity extends BaseEntity {
	@Column()
	name: string;

	@CreateDateColumn()
	createdAt: Date;
}
