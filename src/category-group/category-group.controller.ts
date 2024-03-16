import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { CategoryGroupService } from './category-group.service';
import {
  CategoryGroupFilterType,
  CategoryGroupPaginationResponseType,
  CreateCategoryGroupDto,
  UpdateCategoryGroupDto,
} from './dto/category-group.dto';
import { CategoriesGroup } from '@prisma/client';
import { Request } from 'express';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/dto/Role.enum';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
@ApiBearerAuth()
@ApiTags('Category-group')
@Controller('category-group')
export class CategoryGroupController {
  constructor(private categoryGroupService: CategoryGroupService) {}
  @Post()
  async create(@Req() req: Request, @Body() data: CreateCategoryGroupDto) {
    const userId = Number(req.user['id']);
    return await this.categoryGroupService.create(userId, data);
  }
  @Roles([Role.User])
  @Get('/getAll')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'items_per_page', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'previousPage', required: false })
  @ApiQuery({ name: 'nextPage', required: false })
  async getAllForUser(
    @Req() req: Request,
    @Param() filter: CategoryGroupFilterType,
  ): Promise<CategoryGroupPaginationResponseType> {
    const userId = Number(req.user['id']);
    return this.categoryGroupService.getAllForUser(userId, filter);
  }
  @Roles([Role.Admin])
  @Get('/trash')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'items_per_page', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'previousPage', required: false })
  @ApiQuery({ name: 'nextPage', required: false })
  async getAllTrash(
    @Param() filter: CategoryGroupFilterType,
  ): Promise<CategoryGroupPaginationResponseType> {
    return this.categoryGroupService.getAllTrash(filter);
  }
  @Roles([Role.Admin])
  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'items_per_page', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'previousPage', required: false })
  @ApiQuery({ name: 'nextPage', required: false })
  async getAll(
    @Param() filter: CategoryGroupFilterType,
  ): Promise<CategoryGroupPaginationResponseType> {
    return await this.categoryGroupService.getAll(filter);
  }
  @Get(':id')
  async getDetail(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CategoriesGroup> {
    return await this.categoryGroupService.getDetail(id);
  }
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCategoryGroupDto,
  ): Promise<CategoriesGroup> {
    return await this.categoryGroupService.update(id, data);
  }
  @Delete('force-delete/:id')
  async forceDelete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CategoriesGroup> {
    return await this.categoryGroupService.forceDelete(id);
  }
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CategoriesGroup> {
    return await this.categoryGroupService.delete(id);
  }
}
