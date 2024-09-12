import { Request } from "express";
import { REQUEST } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
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
		@InjectRepository(UserAddressEntity)
		private userAddressRepository: Repository<UserAddressEntity>,
		private dataSource: DataSource,
	) {}

	async create(basket: BasketType, paymentDto: PaymentDto) {
		const { addressId, description = undefined } = paymentDto;
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		try {
			const { id: userId } = this.req.user;
			const address = await this.userAddressRepository.findOneBy({
				id: addressId,
				userId,
			});
			if (!address) throw new NotFoundException("not found address");
			const { bookList, payment_amount, total_amount, total_discount_amount } = basket;
			let order = queryRunner.manager.create(OrderEntity, {
				addressId,
				userId,
				total_amount,
				description,
				discount_amount: total_discount_amount,
				payment_amount,
				status: OrderStatus.Pending,
			});
			order = await queryRunner.manager.save(OrderEntity, order);
			let orderItems: DeepPartial<OrderItemEntity>[] = [];
			for (const item of bookList) {
				orderItems.push({
					count: item.count,
					bookId: item.bookId,
					orderId: order.id,
					status: OrderItemStatus.Pending,
				});
			}
			if (orderItems.length > 0) {
				await queryRunner.manager.insert(OrderItemEntity, orderItems);
			} else {
				throw new BadRequestException("your food list is empty");
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
		if (!order) throw new NotFoundException();
		return order;
	}

	async save(order: OrderEntity) {
		return await this.orderRepository.save(order);
	}
}