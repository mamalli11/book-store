import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { S3Service } from "../s3/s3.service";
import { EditorService } from "./editor.service";
import { AuthModule } from "../auth/auth.module";
import { EditorController } from "./editor.controller";
import { EditorEntity } from "./entities/editor.entity";

@Module({
	imports: [AuthModule, TypeOrmModule.forFeature([EditorEntity])],
	controllers: [EditorController],
	providers: [EditorService, S3Service],
})
export class EditorModule {}
