import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Advice } from '../entities/advice.entity';
import { Case } from '../entities/case.entity';
import { User } from '../../user/entities/user.entity';
import { ApiError } from '../../common/classes/api-error';
import { ErrorCode } from '../../common/constants/errors';
import { CreateAdviceDTO } from '../dtos/advice/create-advice.dto';
import { UpdateAdviceDTO } from '../dtos/advice/update-advice.dto';

@Injectable()
export class AdviceService {
  constructor(
    @InjectRepository(Advice)
    private readonly adviceRepository: Repository<Advice>,
    @InjectRepository(Case)
    private readonly caseRepository: Repository<Case>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getListAdvices(
    caseId: number,
    query: any,
  ): Promise<{
    advices: Advice[];
    total: number;
    page: number;
    limit: number;
    case: Case;
  }> {
    const { title, page = 1, limit = 10 } = query;
    const offset = (page - 1) * limit;

    try {
      const caseEntity = await this.caseRepository.findOne({
        where: { id: caseId },
      });

      if (!caseEntity) {
        throw new ApiError(ErrorCode.NOT_FOUND);
      }

      let where = 'advice.case_id = :caseId';
      const params: any = { caseId };

      if (title) {
        where += ' AND LOWER(advice.title) ILIKE :title';
        params.title = `%${title.toLowerCase()}%`;
      }

      const [advices, total] = await this.adviceRepository
        .createQueryBuilder('advice')
        .where(where, params)
        .orderBy('advice.title', 'ASC')
        .skip(offset)
        .take(limit)
        .getManyAndCount();

      return {
        advices,
        total,
        page,
        limit,
        case: caseEntity,
      };
    } catch (error) {
      console.log(error);
      throw new ApiError(ErrorCode.GENERIC_ERROR);
    }
  }

  async createAdvice(createAdviceDTO: CreateAdviceDTO): Promise<Advice> {
    const { title, content, caseId, userId } = createAdviceDTO;
    try {
      const caseEntity = await this.caseRepository.findOneBy({ id: caseId });
      if (!caseEntity) {
        throw new ApiError(ErrorCode.NOT_FOUND);
      }

      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new ApiError(ErrorCode.NOT_FOUND);
      }

      const newAdvice = this.adviceRepository.create({
        title,
        content,
        case: caseEntity,
      });
      return await this.adviceRepository.save(newAdvice);
    } catch (error) {
      throw new ApiError(ErrorCode.CREATION_FAILED);
    }
  }

  async getAdviceById(adviceId: number): Promise<Advice> {
    try {
      const advice = await this.adviceRepository.findOneBy({ id: adviceId });
      if (!advice) {
        throw new ApiError(ErrorCode.NOT_FOUND);
      }
      return advice;
    } catch (error) {
      throw new ApiError(ErrorCode.NOT_FOUND);
    }
  }

  async updateAdvice(
    adviceId: number,
    updateAdviceDTO: UpdateAdviceDTO,
  ): Promise<Advice> {
    const advice = await this.getAdviceById(adviceId);
    Object.assign(advice, updateAdviceDTO);
    try {
      return await this.adviceRepository.save(advice);
    } catch (error) {
      throw new ApiError(ErrorCode.UPDATE_FAILED);
    }
  }

  async deleteAdvice(adviceId: number): Promise<void> {
    try {
      const result = await this.adviceRepository.delete(adviceId);
      if (result.affected === 0) {
        throw new ApiError(ErrorCode.NOT_FOUND);
      }
    } catch (error) {
      throw new ApiError(ErrorCode.DELETION_FAILED);
    }
  }
}
