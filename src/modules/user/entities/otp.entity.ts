import { Column, Entity, OneToOne } from "typeorm";

import { UserEntity } from "./user.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";

@Entity(EntityName.Otp)
export class OtpEntity extends BaseEntity {
	@Column()
	code: string;

	@Column()
	expiresIn: Date;

	@Column()
	userId: number;

	@Column({ nullable: true })
	method: string;

	@Column({ nullable: true })
	refreshToken: string;

	@OneToOne(() => UserEntity, (user) => user.otp, { onDelete: "CASCADE" })
	user: UserEntity;
}
