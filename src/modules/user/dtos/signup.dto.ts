import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class SignupDTO {
  @ApiProperty({ type: String, description: 'Email of the user' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, description: 'Password of the user' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ type: String, description: 'Full name of the user' })
  @IsNotEmpty()
  @IsString()
  full_name: string;
}
