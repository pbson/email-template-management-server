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
import { TagService } from '../services/tag.service';
import { Tag } from '../entities/tag.entity';
import { ApiResult } from '../../common/classes/api-result';
import { CreateTagDTO } from '../dtos/tag/create-tag.dto';
import { UpdateTagDTO } from '../dtos/tag/update-tag.dto';

@ApiTags('tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of tags' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [Tag],
    description: 'Get list of tags success',
  })
  async getListTags() {
    return new ApiResult().success(await this.tagService.getListTags());
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create tag' })
  @ApiResponse({
    status: 200,
    description: 'Returns newly created tag',
    type: Tag,
  })
  async createTag(@Body() createTagDTO: CreateTagDTO) {
    const { name, color } = createTagDTO;
    return new ApiResult().success(
      await this.tagService.createTag(name, color),
    );
  }

  @Get(':tagId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get tag by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns tag',
    type: Tag,
  })
  @ApiParam({ name: 'tagId', type: Number })
  async getTag(@Param('tagId') tagId: number) {
    return new ApiResult().success(await this.tagService.getTagById(tagId));
  }

  @Put(':tagId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update tag' })
  @ApiResponse({
    status: 200,
    description: 'Tag updated successfully',
    type: Tag,
  })
  @ApiParam({ name: 'tagId', type: Number })
  async updateTag(
    @Param('tagId') tagId: number,
    @Body() updateTagDTO: UpdateTagDTO,
  ) {
    return new ApiResult().success(
      await this.tagService.updateTag(tagId, updateTagDTO),
    );
  }

  @Delete(':tagId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete tag' })
  @ApiResponse({
    status: 200,
    description: 'Tag deleted successfully',
  })
  @ApiParam({ name: 'tagId', type: String })
  @HttpCode(200)
  async deleteTag(@Param('tagId') tagId: number) {
    await this.tagService.deleteTag(tagId);
    return new ApiResult().success(true);
  }
}
