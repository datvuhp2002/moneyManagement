import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.servcie';
import { RoleFilterType, RolePaginationResponseType, SoftDeleteRoleDto } from './dto/role.dto';
import { Role } from '@prisma/client';
import { UpdateRoleDto } from 'src/role/dto/role.dto';
@Injectable()
export class RoleService {
    constructor(private prismaService: PrismaService){}
    async getAll(filters: RoleFilterType): Promise<RolePaginationResponseType> {
        const items_per_page = Number(filters.items_per_page) || 10;
        const page = Number(filters.page) || 1;
        const search = filters.search || '';
        const skip = page > 1 ? (page - 1) * items_per_page : 0;
        const roles = await this.prismaService.role.findMany({
          take: items_per_page,
          skip,
          select: {
            name: true,
            createdAt: true,
          },
          where: {
            OR: [
              {
                name: {
                  contains: search,
                },
              },
  
            ],
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
        const total = await this.prismaService.role.count({
          where: {
            OR: [
              {
                name: {
                  contains: search,
                },
              },

            ],
          },
        });
        const lastPage = Math.ceil(total / items_per_page);
        const nextPage = page + 1 > lastPage ? null : page + 1;
        const previousPage = page - 1 < 1 ? null : page - 1;
        return {
          data: roles,
          total,
          nextPage,
          previousPage,
          currentPage: page,
          itemsPerPage: items_per_page,
        };
    }
    async getDetail(id: number): Promise<Role> {
      return await this.prismaService.role.findUnique({
        where: {
          id,
        },
      });
    }
    async update(id: number, data: UpdateRoleDto): Promise<Role> {
      return await this.prismaService.role.update({
        where: { id },
        data,
      });
    }
    async deleteById(id: number): Promise<Role> {
      console.log('delete id: ', id);
      return await this.prismaService.role.update({
        where: { id },
        data: {
          deleteMark: true,
          deletedAt: new Date(),
        },
      });
    }
    async forceDelete(id: number):Promise<Role>{
      return await this.prismaService.role.delete({
        where:{id, deleteMark:true},
      })
    }
}
