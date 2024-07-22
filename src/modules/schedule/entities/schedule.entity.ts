import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Case } from '../../case/entities/case.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('schedules')
export class Schedule {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ type: String })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ type: Case, required: false })
  @ManyToOne(() => Case, { eager: true, nullable: true })
  @JoinColumn({ name: 'case_id' })
  case?: Case;

  @ApiProperty({ type: User })
  @ManyToOne(() => User, { eager: true, nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ type: Date })
  @Column({ type: 'timestamp' })
  start_timestamp: Date;

  @ApiProperty({ type: Date, required: false })
  @Column({ type: 'timestamp', nullable: true })
  end_timestamp?: Date;

  @ApiProperty({ type: Boolean })
  @Column({ type: 'boolean', default: false })
  is_recurring: boolean;

  @ApiProperty({ type: String })
  @Column({ type: 'enum', enum: ['Active', 'Inactive'], default: 'Active' })
  status: 'Active' | 'Inactive';

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
