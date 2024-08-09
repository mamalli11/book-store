import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";

import { BookEntity } from "./book.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { BaseEntity } from "src/common/abstracts/base.entity";
import { EditorEntity } from "src/modules/editor/entities/editor.entity";

@Entity(EntityName.BookEditors)
export class BookEditorsEntity extends BaseEntity {
	@Column()
	bookId: number;
	@ManyToOne(() => BookEntity, (book) => book.writers, { onDelete: "CASCADE" })
	book: BookEntity;

	@Column()
	editorId: number;
	@ManyToOne(() => EditorEntity, (editor) => editor.book, { onDelete: "CASCADE" })
	editor: EditorEntity;

	@CreateDateColumn()
	created_at: Date;
}
