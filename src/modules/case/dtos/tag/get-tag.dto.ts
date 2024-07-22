import { Tag } from '@modules/case/entities/tag.entity';
import { ApiProperty } from '@nestjs/swagger';

export class GetTagDTO {
  @ApiProperty({ type: [Tag], description: 'List of tags' })
  tags: Tag[];

  @ApiProperty({ type: Number, description: 'Total number of tags' })
  total: number;

  @ApiProperty({ type: Number, description: 'Current page number' })
  page: number;

  @ApiProperty({ type: Number, description: 'Number of items per page' })
  limit: number;
}
