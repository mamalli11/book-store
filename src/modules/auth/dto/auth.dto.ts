import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsJWT, IsString, Length } from "class-validator";

import { AuthMethod } from "../enums/method.enum";

export class AuthDto {
	@ApiProperty({ example: "" })
	@IsString()
	@Length(1, 40)
	emailOrPhone: string;

	@ApiProperty({ enum: AuthMethod, default: AuthMethod.Phone })
	@IsEnum(AuthMethod)
	method: AuthMethod;
}

export class CheckOtpDto {
	@ApiProperty({ example: "" })
	@IsString()
	@IsJWT()
	token: string;

	@ApiProperty({ example: "" })
	@IsString()
	@Length(6, 6)
	code: string;
}

export class RefreshTokenDto {
	@ApiProperty({ example: "" })
	@IsString()
	@IsJWT()
	refreshToken: string;
}
