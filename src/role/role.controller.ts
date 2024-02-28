import { Controller, Get, Param } from '@nestjs/common';
import { RoleService } from './role.service';
import { Public } from 'src/auth/decorator/auth.decorator';
import { RoleFilterType, RolePaginationResponseType } from './dto/role.dto';

@Controller('role')
export class RoleController {
    constructor(private roleService:RoleService){}
    @Get()
    @Public()
    getAll(@Param() params: RoleFilterType):Promise<RolePaginationResponseType>{
        return this.roleService.getAll(params)
    }
}
