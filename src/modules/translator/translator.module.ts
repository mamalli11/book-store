import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { S3Service } from "../s3/s3.service";
import { AuthModule } from "../auth/auth.module";
import { TranslatorService } from "./translator.service";
import { TranslatorController } from "./translator.controller";
import { TranslatorEntity } from "./entities/translator.entity";

@Module({
	imports: [AuthModule, TypeOrmModule.forFeature([TranslatorEntity])],
	controllers: [TranslatorController],
	providers: [TranslatorService, S3Service],
})
export class TranslatorModule {}
