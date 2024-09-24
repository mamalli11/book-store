import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "../auth/auth.module";
import { DiscountService } from "./discount.service";
import { DiscountController } from "./discount.controller";
import { DiscountEntity } from "./entities/discount.entity";
import { OrderEntity } from "../order/entities/order.entity";

@Module({
	imports: [AuthModule, TypeOrmModule.forFeature([DiscountEntity, OrderEntity])],
	controllers: [DiscountController],
	providers: [DiscountService],
})
export class DiscountModule {}
