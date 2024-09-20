import { Request } from "express";
import { REQUEST } from "@nestjs/core";
import { IsNull, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { I18nService, I18nContext } from "nestjs-i18n";
import { Scope, Inject, Injectable, NotFoundException, BadRequestException } from "@nestjs/common";

import { CommentEntity } from "./entities/comment.entity";
import { BookEntity } from "../books/entities/book.entity";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { CommentLikeEntity } from "./entities/commentLike.entity";
import { CreateCommentDto, updateCommentDto } from "./dto/create-comment.dto";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";

@Injectable({ scope: Scope.REQUEST })
export class CommentsService {
	constructor(
		@InjectRepository(CommentEntity) private commentRepository: Repository<CommentEntity>,
		@InjectRepository(BookEntity) private bookRepository: Repository<BookEntity>,
		@InjectRepository(CommentLikeEntity)
		private commentLikeRepository: Repository<CommentLikeEntity>,
		@Inject(REQUEST) private request: Request,
		private readonly i18n: I18nService,
	) {}

	async create(createCommentDto: CreateCommentDto) {
		const { parentId, text, bookId } = createCommentDto;
		const { id: userId } = this.request.user;

		const book = await this.bookRepository.findOneBy({ id: bookId });
		if (!book)
			throw new NotFoundException(
				this.i18n.t("tr.NotFoundMessage.NotFoundBook", { lang: I18nContext.current().lang }),
			);

		let parent = null;

		if (parentId && !isNaN(parentId)) {
			parent = await this.commentRepository.findOneBy({ id: +parentId });
		}

		await this.commentRepository.insert({
			text,
			accepted: true,
			bookId,
			parentId: parent ? parentId : null,
			userId,
		});
		return {
			message: this.i18n.t("tr.PublicMessage.CreatedComment", {
				lang: I18nContext.current().lang,
			}),
		};
	}

	async find(paginationDto: PaginationDto) {
		const { limit, page, skip } = paginationSolver(paginationDto);
		const [comments, count] = await this.commentRepository.findAndCount({
			where: {},
			relations: {
				book: true,
				user: { profile: true },
			},
			select: {
				book: {
					id: true,
					name: true,
				},
				user: {
					id: true,
					profile: {
						lname: true,
						fname: true,
					},
				},
			},
			skip,
			take: limit,
			order: { id: "DESC" },
		});
		return { pagination: paginationGenerator(count, page, limit), comments };
	}

	async findCommentsOfBlog(bookId: number, paginationDto: PaginationDto) {
		const { limit, page, skip } = paginationSolver(paginationDto);
		const [comments, count] = await this.commentRepository.findAndCount({
			where: {
				bookId,
				parentId: IsNull(),
			},
			relations: {
				user: { profile: true },
				children: {
					user: { profile: true },
					children: {
						user: { profile: true },
					},
				},
			},
			select: {
				user: {
					id: true,
					profile: {
						lname: true,
						fname: true,
					},
				},
				children: {
					text: true,
					created_at: true,
					parentId: true,
					user: {
						id: true,
						profile: {
							lname: true,
							fname: true,
						},
					},
					children: {
						text: true,
						created_at: true,
						parentId: true,
						user: {
							id: true,
							profile: {
								lname: true,
								fname: true,
							},
						},
					},
				},
			},
			skip,
			take: limit,
			order: { id: "DESC" },
		});
		return { pagination: paginationGenerator(count, page, limit), comments };
	}

	async update(id: number, updateCommentDto: updateCommentDto) {
		const comment = await this.checkExistById(id);

		if (comment.userId !== this.request.user.id)
			throw new BadRequestException(
				this.i18n.t("tr.BadRequestMessage.NotOwnerComment", {
					lang: I18nContext.current().lang,
				}),
			);

		const { text } = updateCommentDto;
		await this.commentRepository.update({ id }, { text, accepted: false });

		return {
			message: this.i18n.t("tr.PublicMessage.Updated", {
				lang: I18nContext.current().lang,
			}),
		};
	}

	async remove(id: number) {
		const comment = await this.checkExistById(id);

		if (comment.userId !== this.request.user.id)
			throw new BadRequestException(
				this.i18n.t("tr.BadRequestMessage.NotOwnerComment", {
					lang: I18nContext.current().lang,
				}),
			);

		await this.commentRepository.delete({ id });
		return {
			message: this.i18n.t("tr.PublicMessage.Deleted", { lang: I18nContext.current().lang }),
		};
	}

	async checkExistById(id: number) {
		const comment = await this.commentRepository.findOneBy({ id });
		if (!comment)
			throw new NotFoundException(
				this.i18n.t("tr.NotFoundMessage.NotFound", { lang: I18nContext.current().lang }),
			);
		return comment;
	}

	async accept(id: number) {
		const comment = await this.checkExistById(id);
		if (comment.accepted)
			throw new BadRequestException(
				this.i18n.t("tr.BadRequestMessage.AlreadyAccepted", {
					lang: I18nContext.current().lang,
				}),
			);
		comment.accepted = true;
		await this.commentRepository.save(comment);
		return {
			message: this.i18n.t("tr.PublicMessage.Updated", { lang: I18nContext.current().lang }),
		};
	}

	async reject(id: number) {
		const comment = await this.checkExistById(id);
		if (!comment.accepted)
			throw new BadRequestException(
				this.i18n.t("tr.BadRequestMessage.AlreadyRejected", {
					lang: I18nContext.current().lang,
				}),
			);
		comment.accepted = false;
		await this.commentRepository.save(comment);
		return {
			message: this.i18n.t("tr.PublicMessage.Updated", { lang: I18nContext.current().lang }),
		};
	}

	async likeComment(commentId: number) {
		const { id: userId } = this.request.user;
		await this.checkExistById(commentId);
		const isLiked = await this.commentLikeRepository.findOneBy({ userId, commentId });
		let message = this.i18n.t("tr.PublicMessage.LikeComment", {
			lang: I18nContext.current().lang,
		});
		if (isLiked) {
			await this.commentLikeRepository.delete({ id: isLiked.id });
			message = this.i18n.t("tr.PublicMessage.DisLikeComment", {
				lang: I18nContext.current().lang,
			});
		} else {
			await this.commentLikeRepository.insert({ commentId, userId });
		}
		return { message };
	}
}
