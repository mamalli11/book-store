import { Request } from "express";
import { REQUEST } from "@nestjs/core";
import { IsNull, Not, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";

import { BooksService } from "../books/books.service";
import { BasketEntity } from "./entities/basket.entity";
import { BasketMessage } from "src/common/enums/message.enum";
import { DiscountService } from "../discount/discount.service";
import { BasketDto, DiscountBasketDto } from "./dto/basket.dto";

@Injectable()
export class BasketService {
	constructor(
		@InjectRepository(BasketEntity) private basketRepository: Repository<BasketEntity>,
		@Inject(REQUEST) private req: Request,

		private booksService: BooksService,
		private discountService: DiscountService,
	) {}

	async addToBasket(basketDto: BasketDto) {
		const { bookId } = basketDto;
		const { id: userId } = this.req.user;
		await this.booksService.getOne(bookId);

		let basketItem = await this.basketRepository.findOne({
			where: { userId, bookId, is_active: true },
		});

		if (basketItem) {
			basketItem.count += 1;
		} else {
			basketItem = this.basketRepository.create({ bookId, userId });
		}
		await this.basketRepository.save(basketItem);
		return { message: BasketMessage.AddItemToBasket };
	}

	async removeFromBasket(basketDto: BasketDto) {
		const { bookId } = basketDto;
		const { id: userId } = this.req.user;
		await this.booksService.getOne(bookId);

		let basketItem = await this.basketRepository.findOne({
			where: { userId, bookId, is_active: true },
		});

		if (basketItem) {
			if (basketItem.count <= 1) {
				await this.basketRepository.delete({ id: basketItem.id });
			} else {
				basketItem.count -= 1;
				await this.basketRepository.save(basketItem);
			}
			return { message: BasketMessage.RemoveItemToBasket };
		}
		throw new NotFoundException(BasketMessage.NotFoundItemFromBasket);
	}

	async getBasket() {
		const { id: userId } = this.req.user;
		const basketItems = await this.basketRepository.find({
			where: { userId, is_active: true },
			relations: {
				discount: true,
				book: { images: true },
			},
		});

		const books = basketItems.filter((item) => item.bookId);
		const generalDiscounts = basketItems.find((item) => item?.discount?.id);

		let total_amount = 0;
		let payment_amount = 0;
		let total_discount_amount = 0;
		let bookList = [];

		for (const item of books) {
			const { book, count } = item;
			let discount_amount = 0;
			let bookPrice = book.price * count;

			if (book.is_active && book.discount > 0) {
				discount_amount = bookPrice * (book.discount / 100);
				bookPrice -= discount_amount;
			}

			total_amount += bookPrice + discount_amount;
			payment_amount += bookPrice;
			total_discount_amount += discount_amount;

			bookList.push({
				bookId: book.id,
				name: book.name,
				description: book.introduction,
				count,
				price: book.price,
				discountCode: null,
				discount_amount,
				total_amount: book.price * count,
				payment_amount: bookPrice,
				image: book.images,
			});
		}

		let generalDiscountDetail = {};
		if (generalDiscounts?.discount?.active) {
			const { discount } = generalDiscounts;

			const isLimitNotExceeded = discount?.limit === null || discount.limit > discount.usage;

			if (isLimitNotExceeded) {
				let generalDiscount_amount = 0;
				if (discount.percent > 0) {
					generalDiscount_amount = payment_amount * (discount.percent / 100);
				} else if (discount.amount > 0) {
					generalDiscount_amount = discount.amount;
				}
				payment_amount -= generalDiscount_amount;
				total_discount_amount += generalDiscount_amount;

				generalDiscountDetail = {
					code: discount.code,
					percent: discount.percent,
					amount: discount.amount,
					discount_amount: generalDiscount_amount,
				};
			}
		}

		return {
			total_amount,
			payment_amount,
			total_discount_amount,
			bookList,
			generalDiscountDetail,
		};
	}

	async basketDisable(userId: number) {
		const basketItems = await this.basketRepository.find({ where: { userId, is_active: true } });
		const books = basketItems.filter((item) => item.bookId);
		for (const item of books) {
			await this.booksService.decrementStockCount(item.bookId);
		}
		await this.basketRepository.update({ userId, is_active: true }, { is_active: false });
		return true;
	}

	async getBasketDiscount(userId: number) {
		const basketItems = await this.basketRepository.find({
			where: { userId, is_active: true },
			relations: { discount: true },
		});

		const generalDiscounts = basketItems.find((item) => item?.discount?.id);
		if (generalDiscounts?.discount) {
			await this.discountService.useDiscount(generalDiscounts?.discount?.code);
			return true;
		}
		return false;
	}

	async addDiscount(discountDto: DiscountBasketDto) {
		const { code } = discountDto;
		const { id: userId } = this.req.user;
		const discount = await this.discountService.findOneByCode(code);

		if (!discount.active) throw new BadRequestException(BasketMessage.NotActiveDiscount);
		if (discount.limit && discount.limit <= discount.usage) {
			throw new BadRequestException(BasketMessage.LimitFullDiscount);
		}
		if (discount?.expires_in && discount?.expires_in?.getTime() <= new Date().getTime()) {
			throw new BadRequestException(BasketMessage.ExpiredDiscount);
		}

		const userBasketDiscount = await this.basketRepository.findOneBy({
			userId,
			is_active: true,
			discountId: discount.id,
		});

		if (userBasketDiscount) throw new BadRequestException(BasketMessage.AlreadyDiscount);

		const generalDiscount = await this.basketRepository.findOne({
			relations: { discount: true },
			where: {
				userId,
				is_active: true,
				discount: { id: Not(IsNull()) },
			},
		});

		if (generalDiscount) {
			console.log(generalDiscount);
			if (generalDiscount?.discount?.code == code) {
				throw new BadRequestException(BasketMessage.AlreadyDiscount);
			} else if (generalDiscount?.discount?.code != code) {
				await this.basketRepository.delete({ discountId: generalDiscount.discountId, userId });
			}
		}

		await this.basketRepository.insert({ discountId: discount.id, userId, type: "total" });
		return { message: BasketMessage.AddedDiscount };
	}

	async removeDiscount(discountDto: DiscountBasketDto) {
		const { code } = discountDto;
		const { id: userId } = this.req.user;
		const discount = await this.discountService.findOneByCode(code);

		const basketDiscount = await this.basketRepository.findOne({
			where: { discountId: discount.id, is_active: true },
		});

		if (!basketDiscount) throw new BadRequestException(BasketMessage.NotFoundDiscount);

		await this.basketRepository.delete({ discountId: discount.id, userId });
		return { message: BasketMessage.RemoveDiscount };
	}
}
