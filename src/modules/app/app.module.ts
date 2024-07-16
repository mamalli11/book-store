import { join } from "path";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TypeOrmConfig } from "src/config/typeorm.config";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: join(process.cwd(), ".env"),
		}),
		TypeOrmModule.forRoot(TypeOrmConfig()),

	],
	controllers: [],
	providers: [],
})
export class AppModule {}
