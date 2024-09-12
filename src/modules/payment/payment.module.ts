import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";

import { S3Service } from "../s3/s3.service";
import { AuthModule } from "../auth/auth.module";
import { OrderService } from "../order/order.service";
import { BasketService } from "../basket/basket.service";
import { PaymentEntity } from "./entities/payment.entity";
import { OrderEntity } from "../order/entities/order.entity";
import { DiscountService } from "../discount/discount.service";
import { BasketEntity } from "../basket/entities/basket.entity";
import { UserAddressEntity } from "../user/entities/address.entity";
import { DiscountEntity } from "../discount/entities/discount.entity";

@Module({
	imports: [
		AuthModule,
		TypeOrmModule.forFeature([
			BasketEntity,
			DiscountEntity,
			OrderEntity,
			UserAddressEntity,
			PaymentEntity,
		]),
	],
	providers: [PaymentService, BasketService, DiscountService, OrderService, S3Service],
	controllers: [PaymentController],
	exports: [],
})
export class PaymentModule {}
