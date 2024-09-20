import { Request } from "express";
import { REQUEST } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { I18nService, I18nContext } from "nestjs-i18n";
import { DataSource, DeepPartial, Repository } from "typeorm";
import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";

import { OrderEntity } from "./entities/order.entity";
import { PaymentDto } from "../payment/dto/payment.dto";
import { BasketType } from "../basket/types/basket.type";
import { OrderItemEntity } from "./entities/order-items.entity";
import { OrderItemStatus, OrderStatus } from "./enum/status.enum";
import { UserAddressEntity } from "../user/entities/address.entity";

@Injectable({ scope: Scope.REQUEST })
export class OrderService {
	constructor(
		@Inject(REQUEST) private req: Request,
		@InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>,
		@InjectRepository(OrderItemEntity) private orderItemRepository: Repository<OrderItemEntity>,
		@InjectRepository(UserAddressEntity)
		private userAddressRepository: Repository<UserAddressEntity>,
		private readonly i18n: I18nService,
		private dataSource: DataSource,
	) {}

	async create(basket: BasketType, paymentDto: PaymentDto) {
		const { addressId, description = undefined } = paymentDto;
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();

		try {
			await queryRunner.startTransaction();

			const { id: userId } = this.req.user;
			const address = await this.userAddressRepository.findOneBy({ id: addressId, userId });
			if (!address)
				throw new NotFoundException(
					this.i18n.t("tr.NotFoundMessage.NotFoundAddress", {
						lang: I18nContext.current().lang,
					}),
				);

			const { bookList, payment_amount, total_amount, total_discount_amount } = basket;
			let order = queryRunner.manager.create(OrderEntity, {
				userId,
				addressId,
				description,
				total_amount,
				payment_amount,
				status: OrderStatus.Pending,
				discount_amount: total_discount_amount,
			});
			order = await queryRunner.manager.save(OrderEntity, order);

			let orderItems: DeepPartial<OrderItemEntity>[] = [];
			for (const item of bookList) {
				orderItems.push({
					orderId: order.id,
					count: item.count,
					bookId: item.bookId,
					status: OrderItemStatus.Pending,
				});
			}

			if (orderItems.length > 0) {
				await queryRunner.manager.insert(OrderItemEntity, orderItems);
			} else {
				throw new BadRequestException(
					this.i18n.t("tr.BasketMessage.BasketIsEmpty", { lang: I18nContext.current().lang }),
				);
			}

			await queryRunner.commitTransaction();
			await queryRunner.release();
			return order;
		} catch (error) {
			await queryRunner.rollbackTransaction();
			await queryRunner.release();
			throw error;
		}
	}

	async findOne(id: number) {
		const order = await this.orderRepository.findOneBy({ id });
		if (!order)
			throw new NotFoundException(
				this.i18n.t("tr.NotFoundMessage.NotFoundOrder", { lang: I18nContext.current().lang }),
			);
		return order;
	}

	async updateOrderItem(orderId: number, status: string) {
		return await this.orderItemRepository.update({ orderId }, { status });
	}

	async save(order: OrderEntity) {
		return await this.orderRepository.save(order);
	}
}
