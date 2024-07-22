import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/users.module';
import { ScheduleActivityLog } from './entities/schedule-activity-log.entity';
import { Schedule } from './entities/schedule.entity';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './services/schedule.service';
import { Case } from '@modules/case/entities/case.entity';
import { User } from '@modules/user/entities/user.entity';
import { ScheduleRecurrence } from './entities/schedule-recrurrence.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      Schedule,
      ScheduleActivityLog,
      Case,
      User,
      ScheduleRecurrence,
    ]),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
