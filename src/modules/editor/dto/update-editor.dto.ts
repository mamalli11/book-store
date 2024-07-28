import { PartialType } from '@nestjs/swagger';
import { CreateEditorDto } from './create-editor.dto';

export class UpdateEditorDto extends PartialType(CreateEditorDto) {}
