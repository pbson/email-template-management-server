import { Case } from './case.entity';
import { User } from '../../user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class CaseResponse {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: Case })
  @ManyToOne(() => Case, { eager: true })
  @JoinColumn({ name: 'case_id' })
  case: Case;

  @ApiProperty({ type: User })
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ type: 'jsonb' })
  @Column({ type: 'jsonb' })
  content: any;

  @ApiProperty({ type: 'jsonb' })
  @Column({ type: 'jsonb', nullable: true })
  select_advices?: any;

  @ApiProperty({ type: Date })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'select_at',
  })
  select_at: Date;
}
