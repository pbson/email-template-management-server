import { ApiResult } from '@modules/common/classes/api-result';
import { AuthGuard } from '@modules/user/auth.guard';
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
import { CreateScheduleDTO } from './dtos/create-schedule.dto';
import { UpdateScheduleDTO } from './dtos/update-schedule.dto';
import { Schedule } from './entities/schedule.entity';
import { ScheduleService } from './services/schedule.service';
import { UpdateScheduleAndRecurrenceDTO } from './dtos/schedule.dto';

@ApiTags('schedules')
@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of schedules' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get list of schedules success',
  })
  async getListSchedules(@Req() request: any, @Query() query: any) {
    const { page, limit, search } = query;
    return new ApiResult().success(
      await this.scheduleService.getListSchedules(page, limit, search),
    );
  }

  @Get('user')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of user schedules' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get list of user schedules success',
  })
  async getListUserSchedules(@Req() request: any) {
    const { userId } = request['user'];
    if (!userId) {
      throw new HttpException('UserID not found', HttpStatus.CONFLICT);
    }
    return new ApiResult().success(
      await this.scheduleService.getListUserSchedules(userId),
    );
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create schedule' })
  @ApiResponse({
    status: 200,
    description: 'Returns newly created schedule',
    type: Schedule,
  })
  async createSchedule(@Body() createScheduleDTO: CreateScheduleDTO) {
    return new ApiResult().success(
      await this.scheduleService.createSchedule(createScheduleDTO),
    );
  }

  @Get(':scheduleId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get schedule by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns schedule',
    type: Schedule,
  })
  @ApiParam({ name: 'scheduleId', type: Number })
  async getSchedule(@Param('scheduleId') scheduleId: number) {
    return new ApiResult().success(
      await this.scheduleService.getScheduleById(scheduleId),
    );
  }

  @Put(':scheduleId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update schedule' })
  @ApiResponse({
    status: 200,
    description: 'Schedule updated successfully',
    type: Schedule,
  })
  @ApiParam({ name: 'scheduleId', type: Number })
  async updateSchedule(
    @Param('scheduleId') scheduleId: number,
    @Body() updateScheduleDTO: UpdateScheduleDTO,
  ) {
    return new ApiResult().success(
      await this.scheduleService.updateSchedule(scheduleId, updateScheduleDTO),
    );
  }

  @Put(':scheduleId/recurrence')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update schedule and recurrence' })
  @ApiResponse({
    status: 200,
    description: 'Schedule and recurrence updated successfully',
    type: Schedule,
  })
  @ApiParam({ name: 'scheduleId', type: Number })
  async updateScheduleAndRecurrence(
    @Param('scheduleId') scheduleId: number,
    @Body() updateScheduleAndRecurrenceDTO: UpdateScheduleAndRecurrenceDTO,
  ) {
    return new ApiResult().success(
      await this.scheduleService.updateScheduleAndRecurrence(
        scheduleId,
        updateScheduleAndRecurrenceDTO,
      ),
    );
  }

  @Delete(':scheduleId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete schedule' })
  @ApiResponse({
    status: 200,
    description: 'Schedule deleted successfully',
  })
  @ApiParam({ name: 'scheduleId', type: Number })
  @HttpCode(200)
  async deleteSchedule(@Param('scheduleId') scheduleId: number) {
    await this.scheduleService.deleteSchedule(scheduleId);
    return new ApiResult().success(true);
  }
}
