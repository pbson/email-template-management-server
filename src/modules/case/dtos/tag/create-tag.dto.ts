import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDTO {
  @ApiProperty({ type: String, description: 'Name of the tag' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: String, description: 'Color of the tag' })
  @IsNotEmpty()
  @IsString()
  color: string;
}
