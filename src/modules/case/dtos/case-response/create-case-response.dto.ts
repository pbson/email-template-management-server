import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCaseResponseDTO {
  @ApiProperty({ type: Number, description: 'ID of the case' })
  @IsNotEmpty()
  @IsNumber()
  caseId: number;

  @ApiProperty({ type: 'jsonb', description: 'Content of the response' })
  @IsNotEmpty()
  content: any;

  @ApiProperty({ type: 'jsonb', description: 'Content of the response' })
  select_advices?: any;
}
