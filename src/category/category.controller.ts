import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Request } from 'express';
import {
  CategoryFilterType,
  CategoryPaginationResponseType,
} from './dto/category-filter.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/dto/Role.enum';
import { Category } from '@prisma/client';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
@ApiBearerAuth()
@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Roles([Role.Admin, Role.User])
  @Post()
  async create(
    @Req() req: Request,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const userId = Number(req.user['id']);
    return await this.categoryService.create(userId, createCategoryDto);
  }
  @Roles([Role.Admin])
  @Get('/trash')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'items_per_page', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'previousPage', required: false })
  @ApiQuery({ name: 'nextPage', required: false })
  async trash(
    @Param() filter: CategoryFilterType,
  ): Promise<CategoryPaginationResponseType> {
    return await this.categoryService.trash(filter);
  }
  @Roles([Role.User, Role.Admin])
  @Get('/getAll')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'items_per_page', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'previousPage', required: false })
  @ApiQuery({ name: 'nextPage', required: false })
  async getAllForUser(
    @Req() req: Request,
    @Param() filter: CategoryFilterType,
  ): Promise<CategoryPaginationResponseType> {
    console.log('User', req.user);
    const userId = Number(req.user['id']);
    return await this.categoryService.getAllForUser(userId, filter);
  }
  @Roles([Role.Admin])
  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'items_per_page', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'previousPage', required: false })
  @ApiQuery({ name: 'nextPage', required: false })
  async getAll(
    @Param() filter: CategoryFilterType,
  ): Promise<CategoryPaginationResponseType> {
    return await this.categoryService.getAll(filter);
  }
  @Roles([Role.Admin, Role.User])
  @Get(':id')
  async findDetail(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.findDetail(+id);
  }
  @Roles([Role.Admin, Role.User])
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.update(+id, updateCategoryDto);
  }
  @Roles([Role.Admin])
  @Delete('/forceDelete/:id')
  async forceDelete(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.forceDelete(id);
  }
  @Roles([Role.Admin, Role.User])
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.delete(+id);
  }
}
