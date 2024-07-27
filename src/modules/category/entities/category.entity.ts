import {
	Entity,
	Column,
	OneToMany,
	AfterLoad,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
} from "typeorm";

import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { DefaultPath } from "src/common/enums/default-path.enum";

@Entity(EntityName.Category)
export class CategoryEntity extends BaseEntity {
	@Column({ length: 50 })
	title: string;

	@Column({ unique: true, length: 50 })
	slug: string;

	@Column({ default: DefaultPath.CategoryImage })
	image: string;

	@Column({ default: true })
	show: boolean;

	@Column({ nullable: true })
	parentId: number;
	@ManyToOne(() => CategoryEntity, (category) => category.children, { onDelete: "CASCADE" })
	parent: CategoryEntity;
	@OneToMany(() => CategoryEntity, (category) => category.parent)
	children: CategoryEntity[];

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@AfterLoad()
	map() {
		if (this.image != null && this.image != "") {
			const url = this.image.replaceAll("\\", "/");
			this.image = `${process.env.URL}/${url}`;
		}
	}
}
