import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MicrosoftSigninDTO {
  @ApiProperty({ type: String, description: 'Microsoft ID token' })
  @IsNotEmpty()
  @IsString()
  id_token: string;
}
