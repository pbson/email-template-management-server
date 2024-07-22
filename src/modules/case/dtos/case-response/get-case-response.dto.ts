import { CaseResponse } from '@modules/case/entities/case-response.entity';
import { ApiProperty } from '@nestjs/swagger';

export class GetCaseResponseDTO {
  @ApiProperty({ type: [CaseResponse], description: 'List of case responses' })
  caseResponses: CaseResponse[];

  @ApiProperty({ type: Number, description: 'Total number of case responses' })
  total: number;

  @ApiProperty({ type: Number, description: 'Current page number' })
  page: number;

  @ApiProperty({ type: Number, description: 'Number of items per page' })
  limit: number;
}
