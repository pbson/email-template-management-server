import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaseResponse } from '../entities/case-response.entity';
import { Case } from '../entities/case.entity';
import { User } from '../../user/entities/user.entity';
import { ApiError } from '../../common/classes/api-error';
import { ErrorCode } from '../../common/constants/errors';
import { CreateCaseResponseDTO } from '../dtos/case-response/create-case-response.dto';
import { UpdateCaseResponseDTO } from '../dtos/case-response/update-case-response.dto';

@Injectable()
export class CaseResponseService {
  constructor(
    @InjectRepository(CaseResponse)
    private readonly caseResponseRepository: Repository<CaseResponse>,
    @InjectRepository(Case)
    private readonly caseRepository: Repository<Case>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getListCaseResponses(): Promise<CaseResponse[]> {
    try {
      return await this.caseResponseRepository.find();
    } catch (error) {
      throw new ApiError(ErrorCode.GENERIC_ERROR);
    }
  }

  async createCaseResponse(createCaseResponseDTO: any): Promise<CaseResponse> {
    const { caseId, userId, select_advices, content } = createCaseResponseDTO;
    try {
      const caseEntity = await this.caseRepository.findOneBy({ id: caseId });
      if (!caseEntity) {
        throw new ApiError(ErrorCode.NOT_FOUND);
      }

      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new ApiError(ErrorCode.NOT_FOUND);
      }

      const newCaseResponse = this.caseResponseRepository.create({
        case: caseEntity,
        user,
        content,
        select_advices,
      });
      return await this.caseResponseRepository.save(newCaseResponse);
    } catch (error) {
      console.error(error);
      throw new ApiError(ErrorCode.CREATION_FAILED);
    }
  }

  async getCaseResponseById(caseResponseId: number): Promise<CaseResponse> {
    try {
      const caseResponse = await this.caseResponseRepository.findOneBy({
        id: caseResponseId,
      });
      if (!caseResponse) {
        throw new ApiError(ErrorCode.NOT_FOUND);
      }
      return caseResponse;
    } catch (error) {
      throw new ApiError(ErrorCode.NOT_FOUND);
    }
  }

  async updateCaseResponse(
    caseResponseId: number,
    updateCaseResponseDTO: UpdateCaseResponseDTO,
  ): Promise<CaseResponse> {
    const caseResponse = await this.getCaseResponseById(caseResponseId);
    Object.assign(caseResponse, updateCaseResponseDTO);
    try {
      return await this.caseResponseRepository.save(caseResponse);
    } catch (error) {
      throw new ApiError(ErrorCode.UPDATE_FAILED);
    }
  }

  async deleteCaseResponse(caseResponseId: number): Promise<void> {
    try {
      const result = await this.caseResponseRepository.delete(caseResponseId);
      if (result.affected === 0) {
        throw new ApiError(ErrorCode.NOT_FOUND);
      }
    } catch (error) {
      throw new ApiError(ErrorCode.DELETION_FAILED);
    }
  }
}
