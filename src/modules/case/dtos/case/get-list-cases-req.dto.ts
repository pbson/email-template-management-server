import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class GetListCasesReqDTO {
  @ApiProperty({
    type: String,
    description: 'Search term for case title',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    type: Number,
    description: 'Page number for pagination',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({
    type: Number,
    description: 'Number of items per page for pagination',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiProperty({
    type: Number,
    description: 'Tag ID for filtering cases',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  tagId?: number;

  @ApiProperty({
    type: String,
    description: 'Search term for case content',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
