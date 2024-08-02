import { Column, CreateDateColumn, Entity, OneToOne, UpdateDateColumn } from "typeorm";

import { UserEntity } from "./user.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { DefaultPath } from "src/common/enums/default-path.enum";

@Entity(EntityName.Profile)
export class ProfileEntity extends BaseEntity {
	@Column({ nullable: true, length: 50 })
	fname: string;

	@Column({ nullable: true, length: 50 })
	lname: string;

	@Column({ nullable: true, length: 150 })
	bio: string;

	@Column({ default: DefaultPath.UserProfile })
	profile_picture: string;

	@Column({ nullable: true })
	imageKey: string;

	@Column({ default: "other", enum: ["male", "female", "other"] })
	gender: string;

	@Column({ nullable: true })
	birthday: Date;

	@Column({ default: "fa" })
	language: string;

	@Column({ default: "iran" })
	country: string;

	@Column({ nullable: true })
	userId: number;
	@OneToOne(() => UserEntity, (user) => user.profile, { onDelete: "CASCADE" })
	user: UserEntity;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
