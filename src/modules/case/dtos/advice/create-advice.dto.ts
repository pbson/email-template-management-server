import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateAdviceDTO {
  @ApiProperty({ type: String, description: 'Title of the advice' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ type: 'jsonb', description: 'Content of the advice' })
  @IsNotEmpty()
  content: any;

  @ApiProperty({
    type: Number,
    description: 'ID of the case this advice is related to',
  })
  @IsNotEmpty()
  @IsNumber()
  caseId: number;

  userId: number;
}
