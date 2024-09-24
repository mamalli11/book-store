import {
	Injectable,
	ConflictException,
	NotFoundException,
	ForbiddenException,
	BadRequestException,
} from "@nestjs/common";
import { DeepPartial, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { I18nService, I18nContext } from "nestjs-i18n";

import { DiscountEntity } from "./entities/discount.entity";
import { CreateDiscountDto } from "./dto/create-discount.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { OrderEntity } from "../order/entities/order.entity";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";

@Injectable()
export class DiscountService {
	constructor(
		@InjectRepository(DiscountEntity) private discountRepository: Repository<DiscountEntity>,
		@InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>,

		private readonly i18n: I18nService,
	) {}

	async create(createDiscountDto: CreateDiscountDto) {
		const { amount, code, expires_in, limit, percent, start_at, type } = createDiscountDto;
		await this.checkExistCode(code);

		const discountObject: DeepPartial<DiscountEntity> = { code };

		// Check for valid amount/percent
		if ((!amount && !percent) || (amount && percent)) {
			throw new BadRequestException(
				this.i18n.t("tr.BadRequestMessage.AmountOrPercent", {
					lang: I18nContext.current().lang,
				}),
			);
		}

		// Dynamic discount rules can be added here (e.g., different percentages based on order size)
		if (amount && !isNaN(parseFloat(amount.toString()))) {
			discountObject["amount"] = amount;
		} else if (percent && !isNaN(parseFloat(percent.toString()))) {
			discountObject["percent"] = percent;
		}

		if (expires_in && !isNaN(parseInt(expires_in.toString()))) {
			const time = 1000 * 60 * 60 * 24 * expires_in;
			discountObject["expires_in"] = new Date(new Date().getTime() + time);
		}
		if (limit && !isNaN(parseInt(limit.toString()))) {
			discountObject["limit"] = limit;
		}

		const discount = this.discountRepository.create({
			...discountObject,
			start_at,
			type,
		});
		await this.discountRepository.save(discount);
		return {
			message: this.i18n.t("tr.PublicMessage.CreatedDiscount", {
				lang: I18nContext.current().lang,
			}),
		};
	}

	async updateDiscount(id: number, updateDiscountDto: Partial<CreateDiscountDto>) {
		const discount = await this.findOne(id);

		if (!discount) {
			throw new NotFoundException(
				this.i18n.t("tr.NotFoundMessage.NotFoundDiscount", {
					lang: I18nContext.current().lang,
				}),
			);
		}

		if (updateDiscountDto.code) {
			await this.checkExistCode(updateDiscountDto.code);
			discount.code = updateDiscountDto.code;
		}

		if (updateDiscountDto.amount && !isNaN(parseFloat(updateDiscountDto.amount.toString()))) {
			discount.amount = updateDiscountDto.amount;
		} else if (
			updateDiscountDto.percent &&
			!isNaN(parseFloat(updateDiscountDto.percent.toString()))
		) {
			discount.percent = updateDiscountDto.percent;
		}

		if (
			updateDiscountDto.expires_in &&
			!isNaN(parseInt(updateDiscountDto.expires_in.toString()))
		) {
			const time = 1000 * 60 * 60 * 24 * updateDiscountDto.expires_in;
			discount.expires_in = new Date(new Date().getTime() + time);
		}

		if (updateDiscountDto.limit && !isNaN(parseInt(updateDiscountDto.limit.toString()))) {
			discount.limit = updateDiscountDto.limit;
		}

		if (updateDiscountDto.start_at) {
			discount.start_at = updateDiscountDto.start_at;
		}

		if (updateDiscountDto.type) {
			discount.type = updateDiscountDto.type;
		}

		await this.discountRepository.save(discount);
		return {
			message: this.i18n.t("tr.PublicMessage.Updated", {
				lang: I18nContext.current().lang,
			}),
		};
	}

	async findAll(paginationDto: PaginationDto) {
		const { limit, page, skip } = paginationSolver(paginationDto);
		const [discounts, count] = await this.discountRepository.findAndCount({
			where: {},
			skip,
			take: limit,
		});

		return { pagination: paginationGenerator(count, page, limit), discounts };
	}

	async findOne(id: number) {
		const discount = await this.discountRepository.findOneBy({ id });
		if (!discount)
			throw new NotFoundException(
				this.i18n.t("tr.NotFoundMessage.NotFoundDiscount", {
					lang: I18nContext.current().lang,
				}),
			);
		return discount;
	}

	async delete(id: number) {
		await this.findOne(id);
		await this.discountRepository.delete({ id });
		return {
			message: this.i18n.t("tr.PublicMessage.Deleted", { lang: I18nContext.current().lang }),
		};
	}

	// Check if a discount code already exists
	async checkExistCode(code: string) {
		const discount = await this.discountRepository.findOneBy({ code });
		if (discount)
			throw new ConflictException(
				this.i18n.t("tr.ConflictMessage.AlreadyExistDiscountCode", {
					lang: I18nContext.current().lang,
				}),
			);
	}

	async findOneByCode(code: string) {
		const discount = await this.discountRepository.findOneBy({ code });
		if (!discount)
			throw new NotFoundException(
				this.i18n.t("tr.NotFoundMessage.NotFoundDiscount", {
					lang: I18nContext.current().lang,
				}),
			);
		return discount;
	}

	// Use discount and handle conditions like limits, expiration, or combination logic
	async useDiscount(code: string, userId: number, totalPrice: number) {
		const discount = await this.findOneByCode(code);

		if (!discount.active || (discount.expires_in && discount.expires_in < new Date())) {
			throw new BadRequestException(
				this.i18n.t("tr.BasketMessage.NotActiveDiscount", {
					lang: I18nContext.current().lang,
				}),
			);
		}

		// Logic for applying discount to the total price
		let discountValue = discount.percent
			? (totalPrice * discount.percent) / 100
			: discount.amount;
		if (discountValue > totalPrice) discountValue = totalPrice; // Prevent negative total

		// Check if the user has already used this discount
		if (await this.hasUserUsedDiscount(userId, code)) {
			throw new ForbiddenException(
				this.i18n.t("tr.BasketMessage.AlreadyDiscount", {
					lang: I18nContext.current().lang,
				}),
			);
		}

		// Track usage and disable discount if the limit is reached
		discount.usage += 1;
		if (discount.limit !== null && discount.usage >= discount.limit) {
			discount.active = false;
		}
		await this.discountRepository.save(discount);
		return { discountValue, finalPrice: totalPrice - discountValue };
	}

	async hasUserUsedDiscount(userId: number, discountCode: string): Promise<boolean> {
		const discount = await this.discountRepository.findOne({
			where: { code: discountCode },
		});

		if (!discount) {
			throw new NotFoundException(
				this.i18n.t("tr.NotFoundMessage.NotFoundDiscount", {
					lang: I18nContext.current().lang,
				}),
			);
		}

		const userOrders = await this.orderRepository.find({
			where: {
				userId,
				discount_amount: discount.amount || discount.percent,
			},
		});

		return userOrders.length > 0;
	}

	async incrementUsage(discountId: number): Promise<void> {
		const discount = await this.discountRepository.findOneBy({ id: discountId });

		if (!discount) {
			throw new NotFoundException(
				this.i18n.t("tr.NotFoundMessage.NotFoundDiscount", {
					lang: I18nContext.current().lang,
				}),
			);
		}

		// Increment the usage count
		discount.usage += 1;
		await this.discountRepository.save(discount);
	}
}
