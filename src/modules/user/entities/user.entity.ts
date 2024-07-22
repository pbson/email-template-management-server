import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({ type: String, nullable: true })
  @Column({ type: 'varchar', length: 255, select: false, nullable: true })
  password_hash: string;

  @ApiProperty({ enum: ['admin', 'teacher'] })
  @Column({ type: 'enum', enum: ['admin', 'teacher'] })
  role: 'admin' | 'teacher';

  @ApiProperty({ type: String, nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  microsoft_id: string;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', length: 255 })
  full_name: string;

  @ApiProperty({ type: Date })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @ApiProperty({ type: Date })
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt: Date;
}
