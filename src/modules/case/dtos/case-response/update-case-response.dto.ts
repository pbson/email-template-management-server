import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEmail, IsNumber } from 'class-validator';

export class UpdateCaseResponseDTO {
  @ApiProperty({ type: Number, description: 'ID of the case', required: false })
  @IsOptional()
  @IsNumber()
  caseId?: number;

  @ApiProperty({
    type: Number,
    description: 'ID of the user creating the response',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiProperty({
    type: String,
    description: 'Recipient email',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  recipientEmail?: string;

  @ApiProperty({
    type: 'jsonb',
    description: 'Content of the response',
    required: false,
  })
  @IsOptional()
  content?: any;
}
