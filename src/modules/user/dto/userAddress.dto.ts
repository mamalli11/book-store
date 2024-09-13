import { Length, IsString } from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";

export class CreateUserAddressDto {
	@ApiProperty({ example: "" })
	@IsString()
	@Length(3, 50)
	title: string;
	@ApiProperty({ example: "" })
	@IsString()
	@Length(3, 50)
	province: string;
	@ApiProperty({ example: "" })
	@IsString()
	@Length(3, 50)
	city: string;
	@ApiProperty({ example: "" })
	@IsString()
	@Length(5, 150)
	address: string;
	@ApiProperty({ example: "" })
	@IsString()
	@Length(9, 11)
	postal_code: string;
}

export class UpdateUserAddressDto extends PartialType(CreateUserAddressDto) {}
