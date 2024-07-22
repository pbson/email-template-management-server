import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Schedule } from './schedule.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ScheduleActivityLog {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: Schedule })
  @ManyToOne(() => Schedule, { eager: true })
  schedule: Schedule;

  @ApiProperty({ type: String })
  @Column({
    type: 'enum',
    enum: ['Created', 'Updated', 'Status changed', 'Deleted'],
  })
  action: 'Created' | 'Updated' | 'Status changed' | 'Deleted';

  @ApiProperty({ type: String })
  @Column({ type: 'text' })
  details: string;

  @ApiProperty({ type: Date })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'timestamp',
  })
  timestamp: Date;
}
