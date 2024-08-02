import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { S3Service } from "../s3/s3.service";
import { AuthModule } from "../auth/auth.module";
import { PublisherService } from "./publisher.service";
import { PublisherController } from "./publisher.controller";
import { PublisherEntity } from "./entities/publisher.entity";

@Module({
	imports: [AuthModule, TypeOrmModule.forFeature([PublisherEntity])],
	controllers: [PublisherController],
	providers: [PublisherService, S3Service],
})
export class PublisherModule {}
