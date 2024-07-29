import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiError } from '@modules/common/classes/api-error';
import { ErrorCode } from '@modules/common/constants/errors';
import { CreateScheduleDTO } from '@modules/schedule/dtos/create-schedule.dto';
import { UpdateScheduleAndRecurrenceDTO } from '@modules/schedule/dtos/schedule.dto';
import { ScheduleRecurrence } from '@modules/schedule/entities/schedule-recrurrence.entity';
import { Schedule } from '@modules/schedule/entities/schedule.entity';
import { Case } from '@modules/case/entities/case.entity';
import { User } from '@modules/user/entities/user.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(ScheduleRecurrence)
    private readonly scheduleRecurrenceRepository: Repository<ScheduleRecurrence>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Case)
    private readonly caseRepository: Repository<Case>,
  ) {}

  async getListSchedules(
    page: number = 1,
    limit: number = 10,
    search: string = '',
  ) {
    const offset = (page - 1) * limit;
    let where = '1=1'; // A condition that's always true to simplify appending further conditions
    const params: any = {};

    if (search && search.trim() !== '') {
      where +=
        ' AND (LOWER(schedule.name) ILIKE :search OR LOWER(schedule.description) ILIKE :search)';
      params.search = `%${search.toLowerCase()}%`;
    }

    const [schedules, total] = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.user', 'user')
      .leftJoinAndSelect('schedule.case', 'case')
      .where(where, params)
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    const schedulesWithRecurrence = await Promise.all(
      schedules.map(async (schedule) => {
        const recurrence = await this.scheduleRecurrenceRepository.findOne({
          where: { schedule: { id: schedule.id } },
        });
        return { ...schedule, recurrence: recurrence || undefined };
      }),
    );

    return { data: schedulesWithRecurrence, total, page, limit };
  }

  async getListUserSchedules(userId: number) {
    try {
      const [schedules, total] = await this.scheduleRepository
        .createQueryBuilder('schedule')
        .leftJoinAndSelect('schedule.user', 'user')
        .leftJoinAndSelect('schedule.case', 'case')
        .where('schedule.user_id = :userId', { userId })
        .orderBy('schedule.created_at', 'DESC')
        .getManyAndCount();

      const schedulesWithRecurrence = await Promise.all(
        schedules.map(async (schedule) => {
          const recurrence = await this.scheduleRecurrenceRepository.findOne({
            where: { schedule: { id: schedule.id } },
          });
          return { ...schedule, recurrence: recurrence || undefined };
        }),
      );

      return { data: schedulesWithRecurrence, total };
    } catch (error) {
      console.log(error);
      throw new ApiError(ErrorCode.GENERIC_ERROR);
    }
  }

  async createSchedule(createScheduleDTO: CreateScheduleDTO) {
    try {
      const { recurrence, case_id, user_id, ...scheduleData } =
        createScheduleDTO;

      const user = await this.userRepository.findOne({
        where: { id: user_id },
      });
      if (!user) {
        throw new ApiError(ErrorCode.USER_NOT_FOUND);
      }

      let caseEntity;
      if (case_id && case_id !== '') {
        caseEntity = await this.caseRepository.findOne({
          where: { id: case_id as number },
        });
        if (!caseEntity) {
          throw new ApiError(ErrorCode.CASE_NOT_FOUND);
        }
      }

      const newSchedule = this.scheduleRepository.create({
        ...scheduleData,
        user,
        case: caseEntity || undefined,
      });

      const savedSchedule = await this.scheduleRepository.save(newSchedule);

      let savedRecurrence: ScheduleRecurrence | undefined;
      if (recurrence) {
        savedRecurrence = await this.scheduleRecurrenceRepository.save({
          ...recurrence,
          schedule: savedSchedule,
        });
      }

      return { ...savedSchedule, recurrence: savedRecurrence };
    } catch (error) {
      console.error(error);
      throw new ApiError(ErrorCode.CREATION_FAILED);
    }
  }

  async getScheduleById(
    scheduleId: number,
  ): Promise<Schedule & { recurrence?: ScheduleRecurrence }> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
      relations: ['user', 'case'],
    });
    if (!schedule) {
      throw new ApiError(ErrorCode.NOT_FOUND);
    }
    const recurrence = await this.scheduleRecurrenceRepository.findOne({
      where: { schedule: { id: scheduleId } },
    });
    return { ...schedule, recurrence: recurrence || undefined };
  }

  async updateSchedule(
    scheduleId: number,
    updateScheduleDTO: any,
  ): Promise<Schedule> {
    try {
      const { recurrence, case_id, user_id, ...scheduleData } =
        updateScheduleDTO;

      const user = await this.userRepository.findOne({
        where: { id: user_id },
      });
      if (!user) {
        throw new ApiError(ErrorCode.USER_NOT_FOUND);
      }

      let caseEntity = undefined;
      if (case_id) {
        caseEntity = await this.caseRepository.findOne({
          where: { id: case_id },
        });
        if (!caseEntity) {
          throw new ApiError(ErrorCode.CASE_NOT_FOUND);
        }
      }

      const updatedSchedule = await this.scheduleRepository.save({
        id: scheduleId,
        ...scheduleData,
        user,
        case: caseEntity,
      });

      let updatedRecurrence: any;
      if (recurrence) {
        const existingRecurrence =
          await this.scheduleRecurrenceRepository.findOne({
            where: { schedule: { id: scheduleId } },
          });

        if (existingRecurrence) {
          await this.scheduleRecurrenceRepository.update(
            existingRecurrence.id,
            {
              ...recurrence,
            },
          );
          updatedRecurrence = await this.scheduleRecurrenceRepository.findOne({
            where: { id: existingRecurrence.id },
          });
        } else {
          updatedRecurrence = await this.scheduleRecurrenceRepository.save({
            ...recurrence,
            schedule: updatedSchedule,
          });
        }
      }

      return { ...updatedSchedule, recurrence: updatedRecurrence };
    } catch (error) {
      console.error(error);
      throw new ApiError(ErrorCode.UPDATE_FAILED);
    }
  }

  async updateScheduleAndRecurrence(
    scheduleId: number,
    updateScheduleAndRecurrenceDTO: UpdateScheduleAndRecurrenceDTO,
  ) {
    const updatedSchedule = await this.updateSchedule(
      scheduleId,
      updateScheduleAndRecurrenceDTO.schedule,
    );
    const updatedRecurrence = await this.updateScheduleRecurrence(
      scheduleId,
      updateScheduleAndRecurrenceDTO.recurrence,
    );

    return { schedule: updatedSchedule, recurrence: updatedRecurrence };
  }

  async updateScheduleRecurrence(
    scheduleId: number,
    updateScheduleRecurrenceDTO: UpdateScheduleAndRecurrenceDTO['recurrence'],
  ) {
    const scheduleRecurrence = await this.scheduleRecurrenceRepository.findOne({
      where: { schedule: { id: scheduleId } },
    });

    if (!scheduleRecurrence) {
      throw new ApiError(ErrorCode.NOT_FOUND);
    }

    await this.scheduleRecurrenceRepository.update(
      scheduleRecurrence.id,
      updateScheduleRecurrenceDTO,
    );

    return await this.scheduleRecurrenceRepository.findOne({
      where: { id: scheduleRecurrence.id },
    });
  }

  async deleteSchedule(scheduleId: number): Promise<void> {
    try {
      await this.scheduleRecurrenceRepository.delete({
        schedule: { id: scheduleId },
      });
      const result = await this.scheduleRepository.delete(scheduleId);
      if (result.affected === 0) {
        throw new ApiError(ErrorCode.NOT_FOUND);
      }
    } catch (error) {
      console.log(error);
      throw new ApiError(ErrorCode.DELETION_FAILED);
    }
  }
}
