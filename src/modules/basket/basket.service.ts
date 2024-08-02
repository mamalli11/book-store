import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DiscountService } from "../discount/discount.service";
import { BasketEntity } from "./entities/basket.entity";
import { DiscountEntity } from "../discount/entities/discount.entity";
import { BasketDto, DiscountBasketDto } from "./dto/basket.dto";

@Injectable()
export class BasketService {
	constructor(
		@InjectRepository(BasketEntity) private basketRepository: Repository<BasketEntity>,
		@InjectRepository(DiscountEntity) private discountRepository: Repository<DiscountEntity>,
		// private menuService: MenuService,
		private discountService: DiscountService,
		@Inject(REQUEST) private req: Request,
	) {}

	async addToBasket(basketDto: BasketDto) {
		const { id: userId } = this.req.user;
		const { bookId } = basketDto;
		// const book = await this.menuService.getOne(bookId);
		let basketItem = await this.basketRepository.findOne({
			where: {
				userId,
				bookId,
			},
		});
		if (basketItem) {
			basketItem.count += 1;
		} else {
			basketItem = this.basketRepository.create({
				bookId,
				userId,
				count: 1,
			});
		}
		await this.basketRepository.save(basketItem);
		return {
			message: "added book to your basket",
		};
	}
	async removeFromBasket(basketDto: BasketDto) {
		const { id: userId } = this.req.user;
		const { bookId } = basketDto;
		// const book = await this.menuService.getOne(bookId);
		let basketItem = await this.basketRepository.findOne({
			where: {
				userId,
				bookId,
			},
		});
		if (basketItem) {
			if (basketItem.count <= 1) {
				await this.basketRepository.delete({ id: basketItem.id });
			} else {
				basketItem.count -= 1;
				await this.basketRepository.save(basketItem);
			}
			return {
				message: "remove item from basket",
			};
		}
		throw new NotFoundException("not found book item in basket");
	}
	async getBasket() {
		const { id: userId } = this.req.user;
		const basketItems = await this.basketRepository.find({
			relations: {
				discount: true,
				book: {
					// supplier: true,
				},
			},
			where: {
				userId,
			},
		});

		const foods = basketItems.filter((item) => item.bookId);
		// const supplierDiscounts = basketItems.filter((item) => item?.discount?.supplierId);
		// const generalDiscounts = basketItems
		// 	.find
		// 	// (item) => item?.discount?.id && !item.discount.supplierId,
		// 	();
		let total_amount = 0;
		let payment_amount = 0;
		let total_discount_amount = 0;
		let foodList = [];
		for (const item of foods) {
			let discount_amount = 0;
			let discountCode: string = null;
			const { book, count } = item;
			total_amount += book.price * count;
			// const supplierId = book.supplierId;
			let foodPrice = book.price * count;
			if (book.is_active && book.discount > 0) {
				discount_amount += foodPrice * (book.discount / 100);
				foodPrice = foodPrice - foodPrice * (book.discount / 100);
			}
			// const discountItem = supplierDiscounts.find(
			// 	({ discount }) => discount.supplierId === supplierId,
			// );
			// if (discountItem) {
			// 	const {
			// 		discount: { active, amount, percent, limit, usage, code },
			// 	} = discountItem;
			// 	if (active) {
			// 		if (!limit || (limit && limit > usage)) {
			// 			discountCode = code;
			// 			if (percent && percent > 0) {
			// 				discount_amount += foodPrice * (percent / 100);
			// 				foodPrice = foodPrice - foodPrice * (percent / 100);
			// 			} else if (amount && amount > 0) {
			// 				discount_amount += amount;
			// 				foodPrice = amount > foodPrice ? 0 : foodPrice - amount;
			// 			}
			// 		}
			// 	}
			// }
			payment_amount += foodPrice;
			total_discount_amount += discount_amount;
			foodList.push({
				name: book.name,
				description: book.introduction,
				count,
				image: book.imagesId,
				price: book.price,
				total_amount: book.price * count,
				discount_amount,
				payment_amount: book.price * count - discount_amount,
				discountCode,
			});
		}
		let generalDiscountDetail = {};
		// if (generalDiscounts?.discount?.active) {
		// 	const { discount } = generalDiscounts;
		// 	if (discount?.limit && discount.limit > discount.usage) {
		// 		let discount_amount = 0;
		// 		if (discount.percent > 0) {
		// 			discount_amount = payment_amount * (discount.percent / 100);
		// 		} else if (discount.amount > 0) {
		// 			discount_amount = discount.amount;
		// 		}
		// 		payment_amount =
		// 			discount_amount > payment_amount ? 0 : payment_amount - discount_amount;
		// 		total_discount_amount += discount_amount;
		// 		generalDiscountDetail = {
		// 			code: discount.code,
		// 			percent: discount.percent,
		// 			amount: discount.amount,
		// 			discount_amount,
		// 		};
		// 	}
		// }
		return {
			total_amount,
			payment_amount,
			total_discount_amount,
			foodList,
			generalDiscountDetail,
		};
	}

	async addDiscount(discountDto: DiscountBasketDto) {
		const { code } = discountDto;
		const { id: userId } = this.req.user;
		const discount = await this.discountService.findOneByCode(code);
		if (!discount.active) {
			throw new BadRequestException("This discount code is not active");
		}
		if (discount.limit && discount.limit <= discount.usage) {
			throw new BadRequestException("The capacity of this discount code is full");
		}
		if (discount?.expires_in && discount?.expires_in?.getTime() <= new Date().getTime()) {
			throw new BadRequestException("this discount code is expired");
		}
		const userBasketDiscount = await this.basketRepository.findOneBy({
			discountId: discount.id,
			userId,
		});
		if (userBasketDiscount) {
			throw new BadRequestException("Already used discount");
		}
		// if (discount.supplierId) {
		// 	const discountOfSupplier = await this.basketRepository.findOne({
		// 		relations: {
		// 			discount: true,
		// 		},
		// 		where: {
		// 			userId,
		// 			discount: {
		// 				supplierId: discount.supplierId,
		// 			},
		// 		},
		// 	});
		// 	if (discountOfSupplier) {
		// 		throw new BadRequestException("you can not use several of supplier discount ");
		// 	}
		// 	const userBasket = await this.basketRepository.findOne({
		// 		relations: {
		// 			book: true,
		// 		},
		// 		where: {
		// 			userId,
		// 			book: {
		// 				supplierId: discount.supplierId,
		// 			},
		// 		},
		// 	});
		// 	if (!userBasket) {
		// 		throw new BadRequestException("you can not use this discount code in basket");
		// 	}
		// } else if (!discount.supplierId) {
		// 	const generalDiscount = await this.basketRepository.findOne({
		// 		relations: {
		// 			discount: true,
		// 		},
		// 		where: {
		// 			userId,
		// 			discount: {
		// 				id: Not(IsNull()),
		// 				supplierId: IsNull(),
		// 			},
		// 		},
		// 	});
		// 	if (generalDiscount) {
		// 		throw new BadRequestException("Already used general discount");
		// 	}
		// }
		await this.basketRepository.insert({
			discountId: discount.id,
			userId,
		});
		return {
			message: "You added discount code successfully",
		};
	}
	async removeDiscount(discountDto: DiscountBasketDto) {
		const { code } = discountDto;
		const { id: userId } = this.req.user;
		const discount = await this.discountService.findOneByCode(code);
		const basketDiscount = await this.basketRepository.findOne({
			where: {
				discountId: discount.id,
			},
		});
		if (!basketDiscount) throw new BadRequestException("Not found discount in basket");

		await this.basketRepository.delete({ discountId: discount.id, userId });
		return {
			message: "You deleted discount code successfully",
		};
	}
}
