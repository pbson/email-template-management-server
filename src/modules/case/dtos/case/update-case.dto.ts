import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateCaseDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ type: Object })
  @IsOptional()
  content?: any;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  tagId?: number;
}
