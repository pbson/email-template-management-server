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
  Query,
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
import { CaseService } from '../services/case.service';
import { AuthGuard } from '../../user/auth.guard';
import { Case } from '../entities/case.entity';
import { ApiResult } from '../../common/classes/api-result';
import { CreateCaseDTO } from '../dtos/case/create-case.dto';
import { UpdateCaseDTO } from '../dtos/case/update-case.dto';
import { RecentSearch } from '../entities/recent-search.entity';

@ApiTags('cases')
@Controller('cases')
export class CaseController {
  constructor(private readonly caseService: CaseService) {}

  @Get('recent-search')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user recent searches' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [RecentSearch],
    description: 'Get user recent searches success',
  })
  @ApiResponse({
    status: 404,
    description: 'Get user recent searches fail',
  })
  async getUserRecentSearch(@Req() request: any) {
    const { userId } = request['user'];
    if (!userId) {
      throw new HttpException('UserID not found', HttpStatus.CONFLICT);
    }

    return new ApiResult().success(
      await this.caseService.getUserRecentSearch(userId),
    );
  }

  @Post('recent-search')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add user recent search' })
  @ApiResponse({
    status: 200,
    description: 'Recent search added successfully',
    type: RecentSearch,
  })
  async addUserRecentSearch(
    @Req() request: any,
    @Body() createRecentSearchDTO: { caseId: number },
  ) {
    const { userId } = request['user'];
    if (!userId) {
      throw new HttpException('UserID not found', HttpStatus.CONFLICT);
    }

    return new ApiResult().success(
      await this.caseService.addUserRecentSearch(
        userId,
        createRecentSearchDTO.caseId,
      ),
    );
  }

  @Delete('recent-search/:searchId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user recent search' })
  @ApiResponse({
    status: 200,
    description: 'Recent search deleted successfully',
  })
  @ApiParam({ name: 'searchId', type: Number })
  @HttpCode(200)
  async deleteUserRecentSearch(@Param('searchId') searchId: number) {
    await this.caseService.deleteUserRecentSearch(searchId);
    return new ApiResult().success(true);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of cases' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [Case],
    description: 'Get list of cases success',
  })
  @ApiResponse({
    status: 404,
    description: 'Get list of cases fail',
  })
  async getListCases(@Query() query: any) {
    return new ApiResult().success(await this.caseService.getListCases(query));
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create case' })
  @ApiResponse({
    status: 200,
    description: 'Returns newly created case',
    type: Case,
  })
  async createCase(@Req() request: any, @Body() createCaseDTO: CreateCaseDTO) {
    const { userId } = request['user'];
    if (!userId) {
      throw new HttpException('UserID not found', HttpStatus.CONFLICT);
    }

    return new ApiResult().success(
      await this.caseService.createCase(createCaseDTO, userId),
    );
  }

  @Get(':caseId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get case by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns case',
    type: Case,
  })
  @ApiParam({ name: 'caseId', type: Number })
  async getCase(@Param('caseId') caseId: number) {
    return new ApiResult().success(await this.caseService.getCaseById(caseId));
  }

  @Put(':caseId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update case' })
  @ApiResponse({
    status: 200,
    description: 'Case updated successfully',
    type: Case,
  })
  @ApiParam({ name: 'caseId', type: String })
  async updateCase(
    @Param('caseId') caseId: number,
    @Body() updateCaseDTO: UpdateCaseDTO,
  ) {
    return new ApiResult().success(
      await this.caseService.updateCase(caseId, updateCaseDTO),
    );
  }

  @Delete(':caseId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete case' })
  @ApiResponse({
    status: 200,
    description: 'Case deleted successfully',
  })
  @ApiParam({ name: 'caseId', type: String })
  @HttpCode(200)
  async deleteCase(@Param('caseId') caseId: number) {
    await this.caseService.deleteCase(caseId);
    return new ApiResult().success(true);
  }
}
