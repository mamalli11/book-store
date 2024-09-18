import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthService } from "./auth.service";
import { TokenService } from "./tokens.service";
import { AuthController } from "./auth.controller";
import { MailService } from "../http/mail.service";
import { OtpEntity } from "../user/entities/otp.entity";
import { UserEntity } from "../user/entities/user.entity";
import { ProfileEntity } from "../user/entities/profile.entity";

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, OtpEntity, ProfileEntity])],
	controllers: [AuthController],
	providers: [AuthService, JwtService, TokenService, MailService],
	exports: [AuthService, JwtService, TokenService],
})
export class AuthModule {}
