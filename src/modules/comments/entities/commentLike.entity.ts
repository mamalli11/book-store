import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne } from "typeorm";

import { CommentEntity } from "./comment.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { UserEntity } from "../../user/entities/user.entity";
import { BaseEntity } from "src/common/abstracts/base.entity";

@Entity(EntityName.CommentLike)
export class CommentLikeEntity extends BaseEntity {
	@Column()
	commentId: number;

	@Column()
	userId: number;

	@ManyToOne(() => UserEntity, (user) => user.comment_likes, { onDelete: "CASCADE" })
	user: UserEntity;

	@ManyToOne(() => CommentEntity, (comment) => comment.likes, { onDelete: "CASCADE" })
	@JoinColumn({ name: "commentId" })
	comment: CommentEntity;

	@CreateDateColumn()
	created_at: Date;
}
