import { Case } from './case.entity';
import { Tag } from './tag.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class CaseTag {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: Case })
  @ManyToOne(() => Case, { eager: true })
  @JoinColumn({ name: 'case_id' })
  case: Case;

  @ApiProperty({ type: Tag })
  @ManyToOne(() => Tag, { eager: true })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
}
