import { Variable } from '@modules/case/entities/variable.entity';
import { ApiProperty } from '@nestjs/swagger';

export class GetVariableDTO {
  @ApiProperty({ type: [Variable], description: 'List of variables' })
  variables: Variable[];

  @ApiProperty({ type: Number, description: 'Total number of variables' })
  total: number;

  @ApiProperty({ type: Number, description: 'Current page number' })
  page: number;

  @ApiProperty({ type: Number, description: 'Number of items per page' })
  limit: number;
}
