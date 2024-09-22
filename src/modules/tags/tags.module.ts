import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TagsService } from "./tags.service";
import { AuthModule } from "../auth/auth.module";
import { TagsController } from "./tags.controller";
import { TagsEntity } from "./entities/tag.entity";

@Module({
	imports: [AuthModule, TypeOrmModule.forFeature([TagsEntity])],
	controllers: [TagsController],
	providers: [TagsService],
})
export class TagsModule {}
