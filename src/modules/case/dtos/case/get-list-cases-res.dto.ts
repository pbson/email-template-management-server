import { Case } from '@modules/case/entities/case.entity';
import { ApiProperty } from '@nestjs/swagger';

export class GetListCasesResDTO {
  @ApiProperty({ type: [Case], description: 'List of cases' })
  cases: Case[];

  @ApiProperty({ type: Number, description: 'Total number of cases' })
  total: number;

  @ApiProperty({ type: Number, description: 'Current page number' })
  page: number;

  @ApiProperty({ type: Number, description: 'Number of items per page' })
  limit: number;
}
