import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
} from "typeorm";

import { CommentLikeEntity } from "./commentLike.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { BookEntity } from "src/modules/books/entities/book.entity";

@Entity(EntityName.Comment)
export class CommentEntity extends BaseEntity {
	@Column()
	text: string;

	@Column({ default: false })
	accepted: boolean;

	@Column()
	bookId: number;

	@Column()
	userId: number;

	@Column({ nullable: true })
	parentId: number;

	@ManyToOne(() => UserEntity, (user) => user.book_comments, { onDelete: "CASCADE" })
	user: UserEntity;

	@ManyToOne(() => BookEntity, (book) => book.comments, { onDelete: "CASCADE" })
	book: BookEntity;

	@ManyToOne(() => CommentEntity, (parent) => parent.children, { onDelete: "CASCADE" })
	parent: CommentEntity;
	@OneToMany(() => CommentEntity, (comment) => comment.parent)
	@JoinColumn({ name: "parent" })
	children: CommentEntity[];

	@OneToMany(() => CommentLikeEntity, (like) => like.comment)
	likes: CommentLikeEntity[];

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
