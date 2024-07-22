import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDTO {
  @ApiProperty({ type: String, description: 'Email of the user' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ type: String, description: 'New password of the user' })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
