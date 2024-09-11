import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BasketService } from "./basket.service";
import { AuthModule } from "../auth/auth.module";
import { BooksModule } from "../books/books.module";
import { BasketController } from "./basket.controller";
import { BasketEntity } from "./entities/basket.entity";
import { DiscountService } from "../discount/discount.service";
import { DiscountEntity } from "../discount/entities/discount.entity";

@Module({
	imports: [AuthModule, BooksModule, TypeOrmModule.forFeature([BasketEntity, DiscountEntity])],
	controllers: [BasketController],
	providers: [BasketService, DiscountService],
})
export class BasketModule {}
