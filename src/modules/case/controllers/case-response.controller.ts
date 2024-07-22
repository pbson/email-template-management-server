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
import { CaseResponse } from '../entities/case-response.entity';
import { ApiResult } from '../../common/classes/api-result';
import { CreateCaseResponseDTO } from '../dtos/case-response/create-case-response.dto';
import { UpdateCaseResponseDTO } from '../dtos/case-response/update-case-response.dto';
import { CaseResponseService } from '../services/case-response.service';

@ApiTags('case-responses')
@Controller('case-responses')
export class CaseResponseController {
  constructor(private readonly caseResponseService: CaseResponseService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of case responses' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [CaseResponse],
    description: 'Get list of case responses success',
  })
  async getListCaseResponses() {
    return new ApiResult().success(
      await this.caseResponseService.getListCaseResponses(),
    );
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create case response' })
  @ApiResponse({
    status: 200,
    description: 'Returns newly created case response',
    type: CaseResponse,
  })
  async createCaseResponse(
    @Req() request: any,
    @Body() createCaseResponseDTO: CreateCaseResponseDTO,
  ) {
    const { userId } = request['user'];
    if (!userId) {
      throw new HttpException('UserID not found', HttpStatus.CONFLICT);
    }
    const { caseId, content, select_advices } = createCaseResponseDTO;
    return new ApiResult().success(
      await this.caseResponseService.createCaseResponse({
        caseId,
        userId,
        select_advices,
        content,
      }),
    );
  }

  @Get(':caseResponseId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get case response by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns case response',
    type: CaseResponse,
  })
  @ApiParam({ name: 'caseResponseId', type: Number })
  async getCaseResponse(@Param('caseResponseId') caseResponseId: number) {
    return new ApiResult().success(
      await this.caseResponseService.getCaseResponseById(caseResponseId),
    );
  }

  @Put(':caseResponseId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update case response' })
  @ApiResponse({
    status: 200,
    description: 'Case response updated successfully',
    type: CaseResponse,
  })
  @ApiParam({ name: 'caseResponseId', type: Number })
  async updateCaseResponse(
    @Param('caseResponseId') caseResponseId: number,
    @Body() updateCaseResponseDTO: UpdateCaseResponseDTO,
  ) {
    return new ApiResult().success(
      await this.caseResponseService.updateCaseResponse(
        caseResponseId,
        updateCaseResponseDTO,
      ),
    );
  }

  @Delete(':caseResponseId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete case response' })
  @ApiResponse({
    status: 200,
    description: 'Case response deleted successfully',
  })
  @ApiParam({ name: 'caseResponseId', type: Number })
  @HttpCode(200)
  async deleteCaseResponse(@Param('caseResponseId') caseResponseId: number) {
    await this.caseResponseService.deleteCaseResponse(caseResponseId);
    return new ApiResult().success(true);
  }
}
