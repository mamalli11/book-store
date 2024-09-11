import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderService } from './order.service';
import { AuthModule } from '../auth/auth.module';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-items.entity';
import { UserAddressEntity } from '../user/entities/address.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([OrderEntity, OrderItemEntity, UserAddressEntity]),
  ],
  providers: [OrderService],
})
export class OrderModule {}
