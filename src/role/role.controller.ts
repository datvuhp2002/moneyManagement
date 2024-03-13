import { Body, Controller, Get, Delete, Param, ParseIntPipe, Put } from '@nestjs/common';
import { RoleService } from './role.service';
import { Public } from 'src/auth/decorator/auth.decorator';
import { RoleFilterType, RolePaginationResponseType, SoftDeleteRoleDto, UpdateRoleDto } from './dto/role.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role as role } from 'src/auth/dto/Role.enum';
import { Role } from '@prisma/client';
@ApiBearerAuth()
@ApiTags('Role')
@Controller('role')
export class RoleController {
    constructor(private roleService:RoleService){}
    @Roles([role.Admin])
    @Get()
    @ApiQuery({name:"page",required:false})
    @ApiQuery({name:"items_per_page",required:false})
    @ApiQuery({name:"search",required:false})
    @ApiQuery({name:"previousPage",required:false})
    @ApiQuery({name:"nextPage",required:false})
    async getAll(@Param() params: RoleFilterType):Promise<RolePaginationResponseType>{
        return await this.roleService.getAll(params)
    }
    @Roles([role.Admin])
    @Get(':id')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    return await this.roleService.getDetail(id);
    }
    @Roles([role.Admin])
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateRoleDto): Promise<Role> {
      return await this.roleService.update(id, data);
    }
}