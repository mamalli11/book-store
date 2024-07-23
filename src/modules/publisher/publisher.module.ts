import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "../auth/auth.module";
import { PublisherService } from "./publisher.service";
import { PublisherController } from "./publisher.controller";
import { PublisherEntity } from "./entities/publisher.entity";

@Module({
	imports: [AuthModule, TypeOrmModule.forFeature([PublisherEntity])],
	controllers: [PublisherController],
	providers: [PublisherService],
})
export class PublisherModule {}
