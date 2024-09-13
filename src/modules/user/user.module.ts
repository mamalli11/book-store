import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { S3Service } from "../s3/s3.service";
import { UserService } from "./user.service";
import { AuthModule } from "../auth/auth.module";
import { OtpEntity } from "./entities/otp.entity";
import { UserController } from "./user.controller";
import { UserEntity } from "./entities/user.entity";
import { ProfileEntity } from "./entities/profile.entity";
import { UserAddressService } from "./userAddress.service";
import { UserAddressEntity } from "./entities/address.entity";
import { UserAddressController } from "./userAddress.controller";

@Module({
	imports: [
		AuthModule,
		TypeOrmModule.forFeature([OtpEntity, UserEntity, UserAddressEntity, ProfileEntity]),
	],
	controllers: [UserController, UserAddressController],
	providers: [UserService, UserAddressService, S3Service],
	exports: [UserService],
})
export class UserModule {}
