import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, MaxLength } from "class-validator";

import { ConfirmedPassword } from "src/common/decorators/password.decorators";

export class ChangePasswordDto {
	@ApiProperty()
	@IsString()
	@MinLength(8, { message: "Password is too short (8 characters minimum)" })
	@MaxLength(20, { message: "Password is too long (20 characters maximum)" })
	oldPassword: string;

	@ApiProperty()
	@IsString()
	@MinLength(8, { message: "Password is too short (8 characters minimum)" })
	@MaxLength(20, { message: "Password is too long (20 characters maximum)" })
	newPassword: string;

	@ApiProperty()
	@IsString()
	@ConfirmedPassword("newPassword")
	confirmPassword: string;
}
