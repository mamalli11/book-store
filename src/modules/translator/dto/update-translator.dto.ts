import { PartialType } from "@nestjs/swagger";
import { CreateTranslatorDto } from "./create-translator.dto";

export class UpdateTranslatorDto extends PartialType(CreateTranslatorDto) {}
