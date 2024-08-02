import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, Length } from "class-validator";

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
	@Length(5, 5)
	code: string;
}
