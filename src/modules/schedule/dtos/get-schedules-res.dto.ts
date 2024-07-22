import { ApiProperty } from '@nestjs/swagger';
import { Schedule } from '../entities/schedule.entity';

export class GetSchedulesResDTO {
  @ApiProperty({ type: [Schedule], description: 'List of schedules' })
  schedules: Schedule[];

  @ApiProperty({ type: Number, description: 'Total number of schedules' })
  total: number;

  @ApiProperty({ type: Number, description: 'Current page number' })
  page: number;

  @ApiProperty({ type: Number, description: 'Number of items per page' })
  limit: number;
}
