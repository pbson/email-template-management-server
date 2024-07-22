import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateAdviceDTO {
  @ApiProperty({
    type: String,
    description: 'Title of the advice',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    type: 'jsonb',
    description: 'Content of the advice',
    required: false,
  })
  @IsOptional()
  content?: any;

  @ApiProperty({
    type: Number,
    description: 'ID of the case this advice is related to',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  caseId?: number;
}
