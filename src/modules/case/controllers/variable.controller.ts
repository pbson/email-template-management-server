import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
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
import { VariableService } from '../services/variable.service';
import { Variable } from '../entities/variable.entity';
import { ApiResult } from '../../common/classes/api-result';
import { CreateVariableDTO } from '../dtos/variable/create-variable.dto';
import { UpdateVariableDTO } from '../dtos/variable/update-variable.dto';

@ApiTags('variables')
@Controller('variables')
export class VariableController {
  constructor(private readonly variableService: VariableService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of variables' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [Variable],
    description: 'Get list of variables success',
  })
  async getListVariables(@Query('name') name?: string) {
    if (name) {
      return new ApiResult().success(
        await this.variableService.getVariableByName(name),
      );
    }
    return new ApiResult().success(
      await this.variableService.getListVariables(),
    );
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create variable' })
  @ApiResponse({
    status: 200,
    description: 'Returns newly created variable',
    type: Variable,
  })
  async createVariable(@Body() createVariableDTO: CreateVariableDTO) {
    const { name, defaultValue } = createVariableDTO;
    console.log('createVariableDTO', createVariableDTO);
    return new ApiResult().success(
      await this.variableService.createVariable(name, defaultValue),
    );
  }

  @Put(':variableId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update variable' })
  @ApiResponse({
    status: 200,
    description: 'Variable updated successfully',
    type: Variable,
  })
  @ApiParam({ name: 'variableId', type: String })
  async updateVariable(
    @Param('variableId') variableId: number,
    @Body() updateVariableDTO: UpdateVariableDTO,
  ) {
    return new ApiResult().success(
      await this.variableService.updateVariable(variableId, updateVariableDTO),
    );
  }

  @Delete(':variableId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete variable' })
  @ApiResponse({
    status: 200,
    description: 'Variable deleted successfully',
  })
  @ApiParam({ name: 'variableId', type: String })
  @HttpCode(200)
  async deleteVariable(@Param('variableId') variableId: number) {
    await this.variableService.deleteVariable(variableId);
    return new ApiResult().success(true);
  }
}
