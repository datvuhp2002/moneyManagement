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
    @Public()
    getAll(@Param() params: RoleFilterType):Promise<RolePaginationResponseType>{
        console.log('get all role api', params);
        return this.roleService.getAll(params)
    }
    @Public()
    @Get(':id')
    getDetail(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    console.log('get detail role api =>', id);
    return this.roleService.getDetail(id);
    }
    @Put(':id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() body: UpdateRoleDto,
    ): Promise<Role> {
      console.log('update role api =>', id);
      return this.roleService.update(id, body);
    }
}
