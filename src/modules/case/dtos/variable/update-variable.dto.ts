import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateVariableDTO {
  @ApiProperty({
    type: String,
    description: 'Name of the variable',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    type: 'jsonb',
    description: 'Default value of the variable',
    required: false,
  })
  @IsOptional()
  default_value?: any;
}
