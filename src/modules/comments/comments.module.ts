import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "../auth/auth.module";
import { CommentsService } from "./comments.service";
import { CommentEntity } from "./entities/comment.entity";
import { CommentsController } from "./comments.controller";
import { BookEntity } from "../books/entities/book.entity";
import { CommentLikeEntity } from "./entities/commentLike.entity";

@Module({
	imports: [AuthModule, TypeOrmModule.forFeature([CommentEntity, BookEntity, CommentLikeEntity])],
	controllers: [CommentsController],
	providers: [CommentsService],
})
export class CommentsModule {}
