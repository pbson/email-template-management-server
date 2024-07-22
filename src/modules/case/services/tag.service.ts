import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../entities/tag.entity';
import { User } from '../../user/entities/user.entity';
import { ApiError } from '../../common/classes/api-error';
import { ErrorCode } from '../../common/constants/errors';
import { UpdateTagDTO } from '../dtos/tag/update-tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getListTags(): Promise<Tag[]> {
    try {
      return await this.tagRepository.find();
    } catch (error) {
      throw new ApiError(ErrorCode.GENERIC_ERROR);
    }
  }

  async createTag(name: string, color: string): Promise<Tag> {
    try {
      const newTag = this.tagRepository.create({
        name,
        color,
      });
      return await this.tagRepository.save(newTag);
    } catch (error) {
      throw new ApiError(ErrorCode.CREATION_FAILED);
    }
  }

  async getTagById(tagId: number): Promise<Tag> {
    try {
      const tag = await this.tagRepository.findOneBy({ id: tagId });
      if (!tag) {
        throw new ApiError(ErrorCode.NOT_FOUND);
      }
      return tag;
    } catch (error) {
      throw new ApiError(ErrorCode.NOT_FOUND);
    }
  }

  async updateTag(tagId: number, updateTagDTO: UpdateTagDTO): Promise<Tag> {
    const tag = await this.getTagById(tagId);
    Object.assign(tag, updateTagDTO);
    try {
      return await this.tagRepository.save(tag);
    } catch (error) {
      throw new ApiError(ErrorCode.UPDATE_FAILED);
    }
  }

  async deleteTag(tagId: number): Promise<void> {
    try {
      const result = await this.tagRepository.delete(tagId);
      if (result.affected === 0) {
        throw new ApiError(ErrorCode.NOT_FOUND);
      }
    } catch (error) {
      throw new ApiError(ErrorCode.DELETION_FAILED);
    }
  }
}
