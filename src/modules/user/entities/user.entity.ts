import {
	Entity,
	Column,
	OneToOne,
	OneToMany,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
} from "typeorm";

import { OtpEntity } from "./otp.entity";
import { ProfileEntity } from "./profile.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { BasketEntity } from "src/modules/basket/entities/basket.entity";
import { CommentEntity } from "src/modules/comments/entities/comment.entity";
import { CommentLikeEntity } from "src/modules/comments/entities/commentLike.entity";

@Entity(EntityName.User)
export class UserEntity extends BaseEntity {
	@Column({ unique: true, nullable: true })
	email: string;

	@Column({ unique: true, nullable: true })
	phone: string;

	@Column({ default: "user", enum: ["user", "admin"] })
	role: string;

	@Column({ nullable: true })
	new_email: string;

	@Column({ nullable: true })
	new_phone: string;

	@Column({ nullable: true, default: false })
	verify_email: boolean;

	@Column({ nullable: true, default: false })
	verify_phone: boolean;

	@Column({ default: false })
	is_verified: boolean;

	@Column({ default: true })
	is_otp: boolean;

	@Column({ nullable: true })
	otpId: number;
	@OneToOne(() => OtpEntity, (otp) => otp.user, { nullable: true })
	@JoinColumn()
	otp: OtpEntity;

	@Column({ nullable: true })
	profileId: number;
	@OneToOne(() => ProfileEntity, (profile) => profile.user, { nullable: true })
	@JoinColumn({ name: "profileId" })
	profile: ProfileEntity;

	@OneToMany(() => BasketEntity, (basket) => basket.user)
	basket: BasketEntity[];

	@OneToMany(() => CommentLikeEntity, (like) => like.user)
	comment_likes: CommentLikeEntity[];

	// @OneToMany(() => BookBookmarkEntity, (bookmark) => bookmark.user)
	// book_bookmarks: BookBookmarkEntity[];

	// @OneToMany(() => BookBookmarkEntity, (bookmark) => bookmark.user)
	// book_wantToRead: BookBookmarkEntity[];

	@OneToMany(() => CommentEntity, (comment) => comment.user)
	book_comments: CommentEntity[];

	@CreateDateColumn({ type: "time with time zone" })
	created_at: Date;

	@UpdateDateColumn({ type: "time with time zone" })
	updated_at: Date;
}
