import { Advice } from '@modules/case/entities/advice.entity';
import { ApiProperty } from '@nestjs/swagger';

export class GetAdviceDTO {
  @ApiProperty({ type: [Advice], description: 'List of advices' })
  advices: Advice[];

  @ApiProperty({ type: Number, description: 'Total number of advices' })
  total: number;

  @ApiProperty({ type: Number, description: 'Current page number' })
  page: number;

  @ApiProperty({ type: Number, description: 'Number of items per page' })
  limit: number;
}
