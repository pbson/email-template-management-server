import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Case } from '../entities/case.entity';
import { User } from '../../user/entities/user.entity';
import { ApiError } from '@modules/common/classes/api-error';
import { ErrorCode } from '@modules/common/constants/errors';
import { GetListCasesReqDTO } from '../dtos/case/get-list-cases-req.dto';
import { GetListCasesResDTO } from '../dtos/case/get-list-cases-res.dto';
import { UpdateCaseDTO } from '../dtos/case/update-case.dto';
import { CreateCaseDTO } from '../dtos/case/create-case.dto';
import { Tag } from '../entities/tag.entity';
import { CaseTag } from '../entities/case-tag.entity';
import { Advice } from '../entities/advice.entity';
import { RecentSearch } from '../entities/recent-search.entity';
import { CaseResponse } from '../entities/case-response.entity';
import { Schedule } from '@modules/schedule/entities/schedule.entity';

@Injectable()
export class CaseService {
  constructor(
    @InjectRepository(Case)
    private readonly caseRepository: Repository<Case>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(CaseTag)
    private readonly caseTagRepository: Repository<CaseTag>,
    @InjectRepository(Advice)
    private readonly adviceRepository: Repository<Advice>,
    @InjectRepository(RecentSearch)
    private readonly recentSearchRepository: Repository<RecentSearch>,
    @InjectRepository(CaseResponse)
    private readonly caseResponseRepository: Repository<CaseResponse>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async getListCases(query: GetListCasesReqDTO): Promise<GetListCasesResDTO> {
    const { title, page = 1, limit = 10, tagId } = query;
    const offset = (page - 1) * limit;

    try {
      let where = '1=1'; // A condition that's always true to simplify appending further conditions
      const params: any = {};

      if (title && title.trim() !== '') {
        where += ' AND LOWER(case.title) ILIKE :title';
        params.title = `%${title.toLowerCase()}%`;
      }

      let cases: Case[], total: number;

      if (tagId) {
        const caseTags = await this.caseTagRepository.find({
          where: { tag: { id: tagId } },
          relations: ['case'],
        });
        const caseIds = caseTags.map((caseTag) => caseTag.case.id);

        if (caseIds.length === 0) {
          return {
            cases: [],
            total: 0,
            page,
            limit,
          };
        }

        [cases, total] = await this.caseRepository
          .createQueryBuilder('case')
          .where(`${where} AND case.id IN (:...caseIds)`, {
            ...params,
            caseIds,
          })
          .orderBy('case.created_at', 'DESC')
          .skip(offset)
          .take(limit)
          .getManyAndCount();
      } else {
        [cases, total] = await this.caseRepository
          .createQueryBuilder('case')
          .where(where, params)
          .orderBy('case.created_at', 'DESC')
          .skip(offset)
          .take(limit)
          .getManyAndCount();
      }

      // Retrieve tags for each case
      const caseIds = cases.map((c) => c.id);
      const caseTags = await this.caseTagRepository.find({
        where: { case: In(caseIds) },
        relations: ['tag'],
      });

      const casesWithTags = cases.map((caseItem) => {
        const tags = caseTags
          .filter((ct) => ct.case.id === caseItem.id)
          .map((ct) => ct.tag);
        return { ...caseItem, tags };
      });

      return {
        cases: casesWithTags,
        total,
        page,
        limit,
      };
    } catch (error) {
      console.log(error);
      throw new ApiError(ErrorCode.GENERIC_ERROR);
    }
  }
  async createCase(
    createCaseDTO: CreateCaseDTO,
    userId: number,
  ): Promise<Case> {
    const { title, content, tagId } = createCaseDTO;
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new ApiError(ErrorCode.NOT_FOUND);
      }

      const newCase = this.caseRepository.create({
        title,
        content,
      });
      const savedCase = await this.caseRepository.save(newCase);

      if (tagId) {
        const tag = await this.tagRepository.findOneBy({ id: tagId });
        if (tag) {
          const caseTag = this.caseTagRepository.create({
            case: savedCase,
            tag,
          });
          await this.caseTagRepository.save(caseTag);
        }
      }

      return savedCase;
    } catch (error) {
      throw new ApiError(ErrorCode.CREATION_FAILED);
    }
  }

  async getCaseById(caseId: number) {
    try {
      const foundCase = await this.caseRepository.findOne({
        where: { id: caseId },
      });
      if (!foundCase) {
        throw new ApiError(ErrorCode.NOT_FOUND);
      }

      // Retrieve tags for the case
      const caseTags = await this.caseTagRepository.find({
        where: { case: { id: caseId } },
        relations: ['tag'],
      });
      const tags = caseTags.map((ct) => ct.tag);

      return { ...foundCase, tags };
    } catch (error) {
      throw new ApiError(ErrorCode.NOT_FOUND);
    }
  }

  async updateCase(
    caseId: number,
    updateCaseDTO: UpdateCaseDTO,
  ): Promise<Case> {
    const { tagId, ...restUpdateDTO } = updateCaseDTO;
    const existingCase = await this.getCaseById(caseId);
    Object.assign(existingCase, restUpdateDTO);

    if (tagId) {
      const tag = await this.tagRepository.findOneBy({ id: tagId });
      if (tag) {
        await this.caseTagRepository.delete({ case: existingCase }); // Remove existing tags
        const caseTag = this.caseTagRepository.create({
          case: existingCase,
          tag,
        });
        await this.caseTagRepository.save(caseTag);
      }
    }

    try {
      return await this.caseRepository.save(existingCase);
    } catch (error) {
      console.log(error);
      throw new ApiError(ErrorCode.UPDATE_FAILED);
    }
  }

  async deleteCase(caseId: number): Promise<void> {
    try {
      await this.caseTagRepository.delete({ case: { id: caseId } });
      await this.adviceRepository.delete({ case: { id: caseId } });
      await this.caseResponseRepository.delete({ case: { id: caseId } });
      await this.scheduleRepository.delete({ case: { id: caseId } });
      const result = await this.caseRepository.delete(caseId);
      if (result.affected === 0) {
        throw new ApiError(ErrorCode.NOT_FOUND);
      }
    } catch (error) {
      console.log(error);
      throw new ApiError(ErrorCode.DELETION_FAILED);
    }
  }

  async getUserRecentSearch(userId: number): Promise<RecentSearch[]> {
    try {
      const queryBuilder = this.recentSearchRepository
        .createQueryBuilder('recent_search')
        .leftJoinAndSelect('recent_search.case', 'case')
        .where('recent_search.user_id = :userId', { userId })
        .orderBy('recent_search.case_id', 'ASC')
        .addOrderBy('recent_search.created_at', 'DESC')
        .distinctOn(['recent_search.case_id'])
        .limit(5);

      const results = await queryBuilder.getMany();
      return results;
    } catch (error) {
      console.log(error);
      throw new ApiError(ErrorCode.GENERIC_ERROR);
    }
  }

  async addUserRecentSearch(
    userId: number,
    caseId: number,
  ): Promise<RecentSearch> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const caseEntity = await this.caseRepository.findOneBy({ id: caseId });

    if (!user || !caseEntity) {
      throw new Error('User or Case not found');
    }

    const recentSearch = new RecentSearch();
    recentSearch.user = user;
    recentSearch.case = caseEntity;

    return this.recentSearchRepository.save(recentSearch);
  }

  async deleteUserRecentSearch(searchId: number): Promise<void> {
    await this.recentSearchRepository.delete(searchId);
  }
}
