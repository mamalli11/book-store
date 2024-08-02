import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BasketService } from "./basket.service";
import { AuthModule } from "../auth/auth.module";
import { BasketController } from "./basket.controller";
import { BasketEntity } from "./entities/basket.entity";
import { DiscountEntity } from "../discount/entities/discount.entity";

@Module({
	imports: [AuthModule, TypeOrmModule.forFeature([BasketEntity, DiscountEntity])],
	controllers: [BasketController],
	providers: [BasketService],
})
export class BasketModule {}
