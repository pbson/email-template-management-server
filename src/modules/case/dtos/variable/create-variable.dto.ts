import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVariableDTO {
  @ApiProperty({ type: String, description: 'Name of the variable' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: 'jsonb', description: 'Default value of the variable' })
  @IsNotEmpty()
  defaultValue: any;
}
