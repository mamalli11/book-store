import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { WriterService } from "./writer.service";
import { AuthModule } from "../auth/auth.module";
import { WriterController } from "./writer.controller";
import { WriterEntity } from "./entities/writer.entity";

@Module({
	imports: [AuthModule, TypeOrmModule.forFeature([WriterEntity])],
	controllers: [WriterController],
	providers: [WriterService],
})
export class WriterModule {}
