import {
	Entity,
	Column,
	OneToMany,
	AfterLoad,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
} from "typeorm";

import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";

@Entity(EntityName.Category)
export class CategoryEntity extends BaseEntity {
	@Column({ length: 50 })
	title: string;

	@Column({ length: 50 })
	enTitle: string;

	@Column({ nullable: true })
	image: string;

	@Column({ nullable: true })
	parentId: number;
	@OneToMany(() => CategoryEntity, (cat) => cat.parentId)
	@JoinColumn({ name: "parentId" })
	parent: CategoryEntity[];

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@AfterLoad()
	map() {
		if (this.image != "") {
			const url = this.image.replaceAll("\\", "/");
			this.image = `${process.env.URL}/${url}`;
		}
	}
}
