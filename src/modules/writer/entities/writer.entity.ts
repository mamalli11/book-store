import { AfterLoad, Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";

import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { DefaultPath } from "src/common/enums/default-path.enum";

@Entity(EntityName.Writer)
export class WriterEntity extends BaseEntity {
	@Column({ length: 50 })
	fullname: string;

	@Column({ length: 50 })
	enFullName: string;

	@Column({ default: DefaultPath.UserProfile })
	image: string;

	@Column({ length: 200 })
	bio: string;

	@Column({ nullable: true })
	birthday: Date;

	@Column({ nullable: true })
	email: string;

	@Column({ nullable: true })
	phone: string;

	@Column({ nullable: true })
	instagram: string;

	@Column({ nullable: true })
	telegram: string;

	@Column({ nullable: true })
	website: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@AfterLoad()
	map() {
		const url = this.image.replaceAll("\\", "/");
		this.image = `${process.env.URL}/${url}`;
	}
}
