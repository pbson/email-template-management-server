import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateCaseDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: Object })
  @IsNotEmpty()
  content: any;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  tagId?: number;
}
