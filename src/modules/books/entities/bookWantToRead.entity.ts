import { Column, Entity, ManyToOne } from "typeorm";

import { BookEntity } from "./book.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";

@Entity(EntityName.BookWantToRead)
export class BookWantToReadEntity extends BaseEntity {
	@Column()
	bookId: number;
	@Column()
	userId: number;
	@ManyToOne(() => UserEntity, (user) => user.book_wantToRead, { onDelete: "CASCADE" })
	user: UserEntity;
	@ManyToOne(() => BookEntity, (book) => book.book_wantToRead, { onDelete: "CASCADE" })
	book: BookEntity;
}
