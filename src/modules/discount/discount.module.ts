import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "../auth/auth.module";
import { DiscountService } from "./discount.service";
import { DiscountController } from "./discount.controller";
import { DiscountEntity } from "./entities/discount.entity";

@Module({
	imports: [AuthModule, TypeOrmModule.forFeature([DiscountEntity])],
	controllers: [DiscountController],
	providers: [DiscountService],
})
export class DiscountModule {}
