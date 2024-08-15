import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Variable } from '../entities/variable.entity';
import { User } from '../../user/entities/user.entity';
import { ApiError } from '../../common/classes/api-error';
import { ErrorCode } from '../../common/constants/errors';
import { UpdateVariableDTO } from '../dtos/variable/update-variable.dto';

@Injectable()
export class VariableService {
  constructor(
    @InjectRepository(Variable)
    private readonly variableRepository: Repository<Variable>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getListVariables(name?: string): Promise<Variable[]> {
    try {
      if (name) {
        return await this.variableRepository.find({
          where: { name: Like(`%${name}%`) },
        });
      } else {
        return await this.variableRepository.find();
      }
    } catch (error) {
      throw new ApiError(ErrorCode.GENERIC_ERROR);
    }
  }

  async createVariable(
    name: string,
    defaultValue: any,
    isPermanent: boolean,
  ): Promise<Variable> {
    try {
      const formattedName = name.replace(/\s+/g, '_');
      const newVariable = this.variableRepository.create({
        name: formattedName,
        default_value: defaultValue,
        is_permanent: isPermanent,
      });
      return await this.variableRepository.save(newVariable);
    } catch (error) {
      console.error(error);
      throw new ApiError(ErrorCode.CREATION_FAILED);
    }
  }

  async getVariableByName(variableName: string): Promise<Variable> {
    try {
      const variable = await this.variableRepository.findOneBy({
        name: variableName,
      });
      if (!variable) {
        throw new ApiError(ErrorCode.NOT_FOUND);
      }
      return variable;
    } catch (error) {
      throw new ApiError(ErrorCode.NOT_FOUND);
    }
  }

  async getVariableById(variableId: number): Promise<Variable> {
    try {
      const variable = await this.variableRepository.findOneBy({
        id: variableId,
      });
      if (!variable) {
        throw new ApiError(ErrorCode.NOT_FOUND);
      }
      return variable;
    } catch (error) {
      throw new ApiError(ErrorCode.NOT_FOUND);
    }
  }

  async updateVariable(
    variableId: number,
    updateVariableDTO: UpdateVariableDTO,
  ): Promise<Variable> {
    const variable = await this.getVariableById(variableId);
    Object.assign(variable, updateVariableDTO);
    try {
      return await this.variableRepository.save(variable);
    } catch (error) {
      throw new ApiError(ErrorCode.UPDATE_FAILED);
    }
  }

  async deleteVariable(variableId: number): Promise<void> {
    try {
      const result = await this.variableRepository.delete(variableId);
      if (result.affected === 0) {
        throw new ApiError(ErrorCode.NOT_FOUND);
      }
    } catch (error) {
      throw new ApiError(ErrorCode.DELETION_FAILED);
    }
  }
}
