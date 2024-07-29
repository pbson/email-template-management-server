import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseService } from './services/case.service';
import { Case } from './entities/case.entity';
import { Advice } from './entities/advice.entity';
import { Tag } from './entities/tag.entity';
import { CaseTag } from './entities/case-tag.entity';
import { CaseResponse } from './entities/case-response.entity';
import { Variable } from './entities/variable.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/users.module';
import { AdviceController } from './controllers/advice.controller';
import { CaseResponseController } from './controllers/case-response.controller';
import { TagController } from './controllers/tag.controller';
import { VariableController } from './controllers/variable.controller';
import { CaseController } from './controllers/case.controller';
import { AdviceService } from './services/advice.service';
import { CaseResponseService } from './services/case-response.service';
import { TagService } from './services/tag.service';
import { VariableService } from './services/variable.service';
import { RecentSearch } from './entities/recent-search.entity';
import { Schedule } from '@modules/schedule/entities/schedule.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      Case,
      Advice,
      Tag,
      CaseTag,
      CaseResponse,
      Variable,
      User,
      RecentSearch,
      Schedule,
    ]),
  ],
  controllers: [
    CaseController,
    AdviceController,
    TagController,
    VariableController,
    CaseResponseController,
  ],
  providers: [
    CaseService,
    AdviceService,
    TagService,
    VariableService,
    CaseResponseService,
  ],
})
export class CaseModule {}
