import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseIntPipe, Put } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto, WalletFilterType, WalletPaginationResponseType } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/dto/Role.enum';
import { Wallet } from '@prisma/client';
import { Request } from 'express';
import { UpdateCurrencyDto } from 'src/currency/dto/update-currency.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
@ApiBearerAuth()
@ApiTags("Wallet")
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Roles([Role.Admin, Role.User])
  @Post()
  async create(@Req() req: Request,@Body() body: CreateWalletDto) : Promise<Wallet> {
    const userId = Number(req.user['id'])
    return await this.walletService.create(userId, body);
  }

  @Roles([Role.Admin])
  @Get("/trash")
  @ApiQuery({name:"page",required:false})
  @ApiQuery({name:"items_per_page",required:false})
  @ApiQuery({name:"search",required:false})
  @ApiQuery({name:"previousPage",required:false})
  @ApiQuery({name:"nextPage",required:false})
  async getAllTrash(@Param() filter: WalletFilterType):Promise<WalletPaginationResponseType>{
      return await this.walletService.getAllTrash(filter)
  }
  @Get()
  @ApiQuery({name:"page",required:false})
  @ApiQuery({name:"items_per_page",required:false})
  @ApiQuery({name:"search",required:false})
  @ApiQuery({name:"previousPage",required:false})
  @ApiQuery({name:"nextPage",required:false})
  async getAll(@Param() filter: WalletFilterType):Promise<WalletPaginationResponseType>{
      return await this.walletService.getAll(filter)
  }

  @Roles([Role.Admin, Role.User])
  @Get(':id')
  async getDetail(@Param('id', ParseIntPipe) id: number): Promise<Wallet> {
  return await this.walletService.getDetail(id);
  }

  @Roles([Role.Admin])
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateWalletDto): Promise<Wallet> {
    return await this.walletService.update(id, data);
  }
  @Roles([Role.Admin])
  @Delete('force-delete/:id')
  async forceDelete(@Param('id',ParseIntPipe) id:number):Promise<Wallet>{
      return await this.walletService.forceDelete(id)
  }
  @Roles([Role.Admin])
  @Delete(':id')
  async delete(@Param('id',ParseIntPipe) id:number):Promise<Wallet>{
      return await this.walletService.delete(id)
  }
}
