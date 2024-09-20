import {
	Scope,
	Inject,
	Injectable,
	ConflictException,
	NotFoundException,
	BadRequestException,
} from "@nestjs/common";
import { Request } from "express";
import { randomInt } from "crypto";
import { Repository } from "typeorm";
import { REQUEST } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { I18nService, I18nContext } from "nestjs-i18n";

import { PaymentDto } from "./dto/payment.dto";
import { OrderService } from "../order/order.service";
import { BasketService } from "../basket/basket.service";
import { PaymentEntity } from "./entities/payment.entity";
import { ZarinpalService } from "../http/zarinpal.service";
import { OrderItemStatus, OrderStatus } from "../order/enum/status.enum";

@Injectable({ scope: Scope.REQUEST })
export class PaymentService {
	constructor(
		@InjectRepository(PaymentEntity) private paymentRepository: Repository<PaymentEntity>,
		@Inject(REQUEST) private req: Request,
		private orderService: OrderService,
		private readonly i18n: I18nService,
		private basketService: BasketService,
		private zarinpalService: ZarinpalService,
	) {}

	async getGatewayUrl(paymentDto: PaymentDto) {
		const { id: userId, email, phone } = this.req.user;

		const basket = await this.basketService.getBasket();
		const order = await this.orderService.create(basket, paymentDto);
		const payment = this.paymentRepository.create({
			userId,
			orderId: order.id,
			amount: basket.payment_amount,
			status: basket.payment_amount === 0,
			invoice_number: new Date().getTime().toString() + randomInt(10000, 99999).toString(),
		});

		if (!payment.status) {
			const { authority, code, gatewayURL } = await this.zarinpalService.sendRequest({
				amount: basket.payment_amount,
				description: "PAYMENT ORDER",
				user: { email, mobile: phone },
			});
			payment.authority = authority;
			await this.paymentRepository.save(payment);
			return { gatewayURL, code };
		}
		return {
			message: this.i18n.t("tr.BasketMessage.PaymentAlreadySuccessfully", {
				lang: I18nContext.current().lang,
			}),
		};
	}

	async verify(authority: string, status: string) {
		const payment = await this.paymentRepository.findOneBy({ authority });

		if (!payment)
			throw new NotFoundException(
				this.i18n.t("tr.NotFoundMessage.NotFoundPyment", {
					lang: I18nContext.current().lang,
				}),
			);
		if (payment.status)
			throw new ConflictException(
				this.i18n.t("tr.BasketMessage.PaymentHasAlreadyConfirmed", {
					lang: I18nContext.current().lang,
				}),
			);
		if (status === "OK") {
			await this.basketService.getBasketDiscount(payment.userId);
			const order = await this.orderService.findOne(payment.orderId);
			order.status = OrderStatus.Paid;
			await this.orderService.save(order);
			await this.orderService.updateOrderItem(order.id, OrderItemStatus.Sent);
			await this.basketService.basketDisable(order.userId);
			payment.status = true;
		} else {
			throw new BadRequestException(
				this.i18n.t("tr.BasketMessage.PaymentFailed", {
					lang: I18nContext.current().lang,
				}),
			);
		}
		await this.paymentRepository.save(payment);
		return {
			message: this.i18n.t("tr.BasketMessage.PaymentSuccessfully", {
				lang: I18nContext.current().lang,
			}),
		};
	}
}
