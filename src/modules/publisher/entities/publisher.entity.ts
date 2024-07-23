import { AfterLoad, Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";

import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";

@Entity(EntityName.Publisher)
export class Publisher extends BaseEntity {
	@Column({ length: 50 })
	name: string;

	@Column({ length: 50 })
	enName: string;

	@Column({})
	logo: string;

	@Column({})
	website: string;

	@Column({ nullable: true, length: 11 })
	phone: string;

	@Column({ length: 11 })
	work_phone: string;

	@Column({ nullable: true })
	address: string;

	@Column({ nullable: true, length: 50 })
	email: string;

	@Column({ nullable: true, length: 50 })
	instagram: string;

	@Column({ nullable: true, length: 50 })
	telegram: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@AfterLoad()
	map() {
		const url = this.logo.replaceAll("\\", "/");
		this.logo = `${process.env.URL}/${url}`;
	}
}
