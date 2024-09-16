import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNumberString, IsOptional, IsString, Length, Matches } from "class-validator";

import { BookCoverType, StatusBook, TypeBook } from "../enums/types.enum";

export class CreateBookDto {
	@ApiProperty({ example: "" })
	@IsString()
	@Length(2, 150)
	name: string;

	@ApiProperty({ example: "" })
	@IsString()
	@Length(2, 150)
	@Matches(/^[a-zA-Z0-9 ,_-]+$/, { message: "enName values must be entered in English" })
	enName: string;

	@ApiPropertyOptional({ example: "", nullable: true })
	@IsOptional()
	@IsString()
	@Length(1, 60)
	slug: string;

	@ApiProperty({ example: "", description: "درباره کتاب" })
	@IsString()
	@Length(15)
	introduction: string;

	@ApiProperty({ example: 123456789111235 })
	@IsNumberString()
	@Length(15, 20)
	ISBN: string;

	@ApiProperty({ type: String, isArray: true, description: "نویسندگان کتاب", example: [""] })
	writerId: string[] | string;

	@ApiProperty({ type: String, isArray: true, description: "مترجم های کتاب", example: [""] })
	translatorId: string[] | string;

	@ApiProperty({ type: String, isArray: true, description: "ناشر های کتاب", example: [""] })
	publisherId: string[] | string;

	@ApiProperty({ type: String, isArray: true, description: "ویرایشگر های کتاب", example: [""] })
	editorId: string[] | string;

	@ApiProperty({ type: String, isArray: true, description: "دسته بندی های کتاب", example: [""] })
	categoryId: string[] | string;

	@ApiProperty({ example: "1234567891023" })
	@IsString()
	@Length(12, 15)
	shabak: string;

	@ApiProperty({ example: "12345678", description: "National Bibliography Number" })
	@IsString()
	@Length(8, 10)
	nbn: string;

	@ApiProperty({ default: 0, description: "تعداد موجود کتاب" })
	@IsNumberString()
	stockCount: number;

	@ApiProperty({})
	@IsNumberString()
	price: number;

	@ApiPropertyOptional({ example: 0, description: "درصد تخفیف", minimum: 0, maximum: 100 })
	@IsNumberString()
	@IsOptional()
	discount: number;

	@ApiProperty({ default: "0", description: "وزن کتاب" })
	@IsString()
	weightBook: string;

	@ApiProperty({ default: 1, description: "تعداد صفحات کتاب" })
	@IsNumberString()
	numberOfPage: number;

	@ApiProperty({ example: 1403, description: "سال چاپ کتاب" })
	@IsNumberString()
	@Length(4, 4)
	yearOfPublication: number;

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
