import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../../user/auth.guard';

import { Advice } from '../entities/advice.entity';
import { ApiResult } from '../../common/classes/api-result';
import { CreateAdviceDTO } from '../dtos/advice/create-advice.dto';
import { UpdateAdviceDTO } from '../dtos/advice/update-advice.dto';
import { AdviceService } from '../services/advice.service';

@ApiTags('advice')
@Controller('advice')
export class AdviceController {
  constructor(private readonly adviceService: AdviceService) {}

  @Get(':caseId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of advice' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [Advice],
    description: 'Get list of advice success',
  })
  @ApiParam({ name: 'caseId', type: Number })
  async getListAdvice(@Param('caseId') caseId: number, @Query() query: any) {
    return new ApiResult().success(
      await this.adviceService.getListAdvices(caseId, query),
    );
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create advice' })
  @ApiResponse({
    status: 200,
    description: 'Returns newly created advice',
    type: Advice,
  })
  async createAdvice(
    @Req() request: any,
    @Body() createAdviceDTO: CreateAdviceDTO,
  ) {
    const { userId } = request['user'];
    if (!userId) {
      throw new HttpException('UserID not found', HttpStatus.CONFLICT);
    }
    const { title, content, caseId } = createAdviceDTO;
    return new ApiResult().success(
      await this.adviceService.createAdvice({ title, content, caseId, userId }),
    );
  }

  @Get(':adviceId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get advice by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns advice',
    type: Advice,
  })
  @ApiParam({ name: 'adviceId', type: Number })
  async getAdvice(@Param('adviceId') adviceId: number) {
    return new ApiResult().success(
      await this.adviceService.getAdviceById(adviceId),
    );
  }

  @Put(':adviceId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update advice' })
  @ApiResponse({
    status: 200,
    description: 'Advice updated successfully',
    type: Advice,
  })
  @ApiParam({ name: 'adviceId', type: String })
  async updateAdvice(
    @Param('adviceId') adviceId: number,
    @Body() updateAdviceDTO: UpdateAdviceDTO,
  ) {
    return new ApiResult().success(
      await this.adviceService.updateAdvice(adviceId, updateAdviceDTO),
    );
  }

  @Delete(':adviceId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete advice' })
  @ApiResponse({
    status: 200,
    description: 'Advice deleted successfully',
  })
  @ApiParam({ name: 'adviceId', type: Number })
  @HttpCode(200)
  async deleteAdvice(@Param('adviceId') adviceId: number) {
    await this.adviceService.deleteAdvice(adviceId);
    return new ApiResult().success(true);
  }
}
