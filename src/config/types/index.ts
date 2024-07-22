import { ValidateNested, IsEnum, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { DatabaseConfig } from './database';
import { AwsConfig } from './aws';
import { JwtConfig } from './jwt';

export enum AppEnv {
  Local = 'local',
  Staging = 'staging',
  Production = 'production',
}

export * from './aws';

export class Config {
  @IsEnum(AppEnv)
  @IsNotEmpty()
  @Expose({ name: 'app_env' })
  appEnv: string;

  @ValidateNested()
  @IsNotEmpty()
  database: DatabaseConfig;

  @ValidateNested()
  @IsNotEmpty()
  aws: AwsConfig;

  @ValidateNested()
  @IsNotEmpty()
  jwt: JwtConfig;
}
