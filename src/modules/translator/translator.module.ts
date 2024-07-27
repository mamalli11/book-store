import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "../auth/auth.module";
import { TranslatorService } from "./translator.service";
import { TranslatorController } from "./translator.controller";
import { TranslatorEntity } from "./entities/translator.entity";

@Module({
	imports: [AuthModule, TypeOrmModule.forFeature([TranslatorEntity])],
	controllers: [TranslatorController],
	providers: [TranslatorService],
})
export class TranslatorModule {}
