import { Body, Controller, Get, Delete, Param, ParseIntPipe, Put } from '@nestjs/common';
import { RoleService } from './role.service';
import { Public } from 'src/auth/decorator/auth.decorator';
import { RoleFilterType, RolePaginationResponseType, SoftDeleteRoleDto, UpdateRoleDto } from './dto/role.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

@ApiTags('Role')
@Controller('role')
export class RoleController {
    constructor(private roleService:RoleService){}
    @Get()
    async getAll(@Param() params: RoleFilterType):Promise<RolePaginationResponseType>{
        return await this.roleService.getAll(params)
    }
    @Get(':id')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    return await this.roleService.getDetail(id);
    }
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateRoleDto): Promise<Role> {
      return await this.roleService.update(id, data);
    }
}