import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class PaymentDto {
	@ApiProperty()
	addressId: number;
	@ApiPropertyOptional()
	description?: string;
}

export class PaymentDataDto {
	amount: number;
	userId: number;
	orderId: number;
	status: boolean;
	invoice_number: string;
}
