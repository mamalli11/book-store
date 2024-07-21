import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsNumberString, IsOptional, IsString, Length } from "class-validator";

import { BookCoverType, StatusBook, TypeBook } from "../enums/types.enum";

export class CreateBookDto {
	@ApiProperty({ example: "" })
	@IsString()
	@Length(1, 150)
	name: string;

	@ApiProperty({ example: "" })
	@IsString()
	@Length(1, 150)
	enName: string;

	@ApiProperty({ example: "", description: "درباره کتاب" })
	@IsString()
	@Length(20, 500)
	introduction: string;

	@ApiProperty({ example: "" })
	@IsNumber()
	@Length(15, 20)
	ISBN: number;

	@ApiProperty({ example: "" })
	@IsNumber()
	writerId: string;
	@ApiPropertyOptional({ example: "" })
	@IsString()
	translatorId: string;
	@ApiProperty({ example: "" })
	@IsString()
	publisherId: string;
	@ApiPropertyOptional({ example: "" })
	@IsString()
	editorId: string;
	@ApiProperty({ example: "" })
	@IsString()
	categoryId: string;

	@ApiProperty({ example: "" })
	@IsString()
	@Length(12, 15)
	shabak: string;

	@ApiProperty({ example: "", description: "National Bibliography Number" })
	@IsString()
	@Length(8, 10)
	nbn: string;

	@ApiProperty({ default: 0, description: "تعداد موجود کتاب" })
	@IsNumber()
	stockCount: number;

	@ApiProperty({})
	@IsNumber()
	price: number;

	@ApiProperty({ default: 0, description: "تخفیف" })
	@IsNumber()
	discount: number;

	@ApiProperty({ default: 0, description: "وزن کتاب", type: "float" })
	@IsNumber()
	weightBook: number;

	@ApiProperty({ default: 1, description: "تعداد صفحات کتاب" })
	@IsNumber()
	numberOfPage: number;

	@ApiProperty({ example: "1403", description: "سال چاپ کتاب" })
	@IsNumber()
	@Length(3, 4)
	yearOfPublication: string;

	@ApiProperty({ enum: BookCoverType, default: BookCoverType.shameez })
	@IsEnum(BookCoverType)
	bookCoverType: BookCoverType;

	@ApiProperty({ enum: TypeBook, default: TypeBook.Book })
	@IsEnum(TypeBook)
	type: TypeBook;

	@ApiProperty({ enum: StatusBook, default: StatusBook.Public })
	@IsEnum(StatusBook)
	status: StatusBook;

	@ApiProperty({ format: "binary" })
	media1: string;

	@ApiPropertyOptional({ nullable: true, format: "binary" })
	@IsOptional()
	media2: string;

	@ApiPropertyOptional({ nullable: true, format: "binary" })
	@IsOptional()
	media3: string;

	@ApiPropertyOptional({ nullable: true, format: "binary" })
	@IsOptional()
	media4: string;

	@ApiPropertyOptional({ nullable: true, format: "binary" })
	@IsOptional()
	media5: string;
}
