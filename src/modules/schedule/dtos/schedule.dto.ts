import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateScheduleDTO {
  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: Number, required: false })
  @IsInt()
  @IsOptional()
  case_id?: number;

  @ApiProperty({ type: Number })
  @IsInt()
  user_id: number;

  @ApiProperty({ type: Date })
  @IsDateString()
  start_timestamp: Date;

  @ApiProperty({ type: Date })
  @IsDateString()
  @IsOptional()
  end_timestamp?: Date;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  is_recurring: boolean;

  @ApiProperty({ type: String })
  @IsString()
  status: 'Active' | 'Inactive';
}

export class UpdateScheduleDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: Number, required: false })
  @IsInt()
  @IsOptional()
  case_id?: number;

  @ApiProperty({ type: Date })
  @IsDateString()
  @IsOptional()
  start_timestamp?: Date;

  @ApiProperty({ type: Date })
  @IsDateString()
  @IsOptional()
  end_timestamp?: Date;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  @IsOptional()
  is_recurring?: boolean;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  status?: 'Active' | 'Inactive';
}

export class UpdateScheduleRecurrenceDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  frequency?: 'OneTime' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly' | 'Custom';

  @ApiProperty({ type: Number })
  @IsInt()
  @IsOptional()
  interval?: number;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  days_of_week?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  days_of_month?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  months_of_year?: string;
}

export class UpdateScheduleAndRecurrenceDTO {
  @ApiProperty({ type: UpdateScheduleDTO })
  schedule: UpdateScheduleDTO;

  @ApiProperty({ type: UpdateScheduleRecurrenceDTO })
  recurrence: UpdateScheduleRecurrenceDTO;
}
