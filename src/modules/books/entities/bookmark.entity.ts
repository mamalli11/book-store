import { Column, Entity, ManyToOne } from "typeorm";

import { BookEntity } from "./book.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";

@Entity(EntityName.BookBookmark)
export class BookBookmarkEntity extends BaseEntity {
	@Column()
	bookId: number;
	@Column()
	userId: number;
	@ManyToOne(() => UserEntity, (user) => user.book_bookmarks, { onDelete: "CASCADE" })
	user: UserEntity;
	@ManyToOne(() => BookEntity, (book) => book.bookmarks, { onDelete: "CASCADE" })
	book: BookEntity;
}
