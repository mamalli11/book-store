import { PartialType } from "@nestjs/swagger";
import { CreateWriterDto } from "./create-writer.dto";

export class UpdateWriterDto extends PartialType(CreateWriterDto) {}
