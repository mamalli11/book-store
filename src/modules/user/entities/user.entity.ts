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

// import { PostEntity } from "src/modules/post/entities/post.entity";
// import { PostLikeEntity } from "src/modules/post/entities/postLike.entity";
// import { PostCommentEntity } from "src/modules/post/entities/comment.entity";
// import { PostBookmarkEntity } from "src/modules/post/entities/bookmark.entity";
// import { PostCommentLikeEntity } from "src/modules/post/entities/postCommentLike.entity";

@Entity(EntityName.User)
export class UserEntity extends BaseEntity {
	@Column({ unique: true, nullable: true })
	email: string;

	@Column({ unique: true, nullable: true })
	phone: string;

	@Column({ default: "user", enum: ["user", "admin", "writer"] })
	uType: string;

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

	// @OneToMany(() => BookCommentLikeEntity, (like) => like.user)
	// book_comment_likes: BookCommentLikeEntity[];

	// @OneToMany(() => BookBookmarkEntity, (bookmark) => bookmark.user)
	// book_bookmarks: BookBookmarkEntity[];

	// @OneToMany(() => BookBookmarkEntity, (bookmark) => bookmark.user)
	// book_wantToRead: BookBookmarkEntity[];

	// @OneToMany(() => BookCommentEntity, (comment) => comment.user)
	// book_comments: BookCommentEntity[];

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
