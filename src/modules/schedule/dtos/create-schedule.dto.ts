import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateScheduleRecurrenceDTO {
  @ApiProperty({
    type: String,
    enum: ['OneTime', 'Daily', 'Weekly', 'Monthly', 'Yearly', 'Custom'],
  })
  @IsString()
  frequency: 'OneTime' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly' | 'Custom';

  @ApiProperty({ type: Number, required: false })
  @IsInt()
  @IsOptional()
  interval?: number;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  days_of_week?: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  days_of_month?: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  months_of_year?: string;
}

export class CreateScheduleDTO {
  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: String, required: false })
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

  @ApiProperty({ type: String })
  @IsDateString()
  start_timestamp: Date;

  @ApiProperty({ type: String, required: false })
  @IsDateString()
  @IsOptional()
  end_timestamp?: Date;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  is_recurring: boolean;

  @ApiProperty({ type: String, enum: ['Active', 'Inactive'] })
  @IsString()
  status: 'Active' | 'Inactive';

  @ApiProperty({ type: CreateScheduleRecurrenceDTO, required: false })
  @ValidateNested()
  @Type(() => CreateScheduleRecurrenceDTO)
  @IsOptional()
  recurrence?: CreateScheduleRecurrenceDTO;
}
