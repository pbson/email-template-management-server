import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsDate,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class UpdateScheduleDTO {
  @ApiProperty({
    type: String,
    description: 'Name of the job',
    required: false,
  })
  @IsOptional()
  @IsString()
  job_name?: string;

  @ApiProperty({
    type: String,
    description: 'Description of the job',
    required: false,
  })
  @IsOptional()
  @IsString()
  job_description?: string;

  @ApiProperty({
    type: Number,
    description: 'ID of the case associated with the job',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  caseId?: number;

  @ApiProperty({
    type: [String],
    description: 'Recipients of the schedule',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  recipients?: string[];

  @ApiProperty({
    type: Date,
    description: 'Start date of the schedule',
    required: false,
  })
  @IsOptional()
  @IsDate()
  start_date?: Date;

  @ApiProperty({
    type: String,
    description: 'Start time of the schedule',
    required: false,
  })
  @IsOptional()
  @IsString()
  start_time?: string;

  @ApiProperty({
    type: Date,
    description: 'End date of the schedule',
    required: false,
  })
  @IsOptional()
  @IsDate()
  end_date?: Date;

  @ApiProperty({
    type: String,
    description: 'End time of the schedule',
    required: false,
  })
  @IsOptional()
  @IsString()
  end_time?: string;

  @ApiProperty({
    type: String,
    description: 'Frequency of the schedule',
    required: false,
  })
  @IsOptional()
  @IsString()
  frequency?: string;

  @ApiProperty({
    type: String,
    description: 'Notification settings for the schedule',
    required: false,
  })
  @IsOptional()
  @IsString()
  notification?: string;

  @ApiProperty({
    enum: ['Active', 'Inactive'],
    description: 'Status of the schedule',
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: 'Active' | 'Inactive';
}
