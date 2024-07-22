import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTagDTO {
  @ApiProperty({
    type: String,
    description: 'Name of the tag',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    type: String,
    description: 'Color of the tag',
    required: false,
  })
  @IsOptional()
  @IsString()
  color?: string;
}
