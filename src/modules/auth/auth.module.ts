import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { OtpEntity } from "../user/entities/otp.entity";
import { UserEntity } from "../user/entities/user.entity";
import { ProfileEntity } from "../user/entities/profile.entity";
import { TokenService } from "./tokens.service";

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, OtpEntity, ProfileEntity])],
	controllers: [AuthController],
	providers: [AuthService, JwtService, TokenService],
	exports: [AuthService, JwtService, TokenService],
})
export class AuthModule {}
