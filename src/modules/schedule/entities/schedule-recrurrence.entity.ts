import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Schedule } from './schedule.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('schedule_recurrences')
export class ScheduleRecurrence {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: Schedule })
  @ManyToOne(() => Schedule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule;

  @ApiProperty({ type: String })
  @Column({
    type: 'varchar',
    length: 50,
    enum: ['OneTime', 'Daily', 'Weekly', 'Monthly', 'Yearly', 'Custom'],
  })
  frequency: 'OneTime' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly' | 'Custom';

  @ApiProperty({ type: Number, required: false })
  @Column({ type: 'int', default: 1, nullable: true })
  interval?: number;

  @ApiProperty({ type: String, required: false })
  @Column({ type: 'text', nullable: true })
  days_of_week?: string;

  @ApiProperty({ type: String, required: false })
  @Column({ type: 'text', nullable: true })
  days_of_month?: string;

  @ApiProperty({ type: String, required: false })
  @Column({ type: 'text', nullable: true })
  months_of_year?: string;

  @ApiProperty({ type: Date })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  created_at: Date;

  @ApiProperty({ type: Date })
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updated_at: Date;
}
