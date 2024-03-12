import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UploadedFile, BadRequestException, UseInterceptors, ParseIntPipe, Put } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Request } from 'express';
import { TransactionFilterType, TransactionPaginationResponseType } from './dto/filter-type.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/dto/Role.enum';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { ApiTags } from '@nestjs/swagger';
@ApiTags("Transaction")
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
  @Post()
  @UseInterceptors(
    FileInterceptor('paymentImage', {
      storage: storageConfig('paymentImage'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.jpeg'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError = `Wrong file size. Accepted file size is than 5MB`;
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  async create(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,@Body() createTransactionDto: CreateTransactionDto) {
      if (req.fileValidationError) {
        console.log("bug")
        throw new BadRequestException(req.fileValidationError);
      }
      if(file){
        createTransactionDto.paymentImage = file.fieldname + '/' + file.filename;
      }else{
        createTransactionDto.paymentImage = null
      }
      const userId = Number(req.user['id']);
      return await this.transactionService.create(userId,createTransactionDto );
  }
  @Roles([Role.Admin])
  @Get()
  async getAll(@Param() filter: TransactionFilterType):Promise<TransactionPaginationResponseType> {
    return await this.transactionService.getAll(filter);
  }
  @Roles([Role.Admin])
  @Get("trash")
  async trash(@Param() filter: TransactionFilterType):Promise<TransactionPaginationResponseType> {
    return await this.transactionService.trash(filter);
  }
  @Roles([Role.User])
  @Get('getAll')
  async getAllForUser(@Req() req: Request,@Param() filter: TransactionFilterType):Promise<TransactionPaginationResponseType> {
    const userId = req.user['id']
    return await this.transactionService.getAllForUser(userId,filter);
  }
  @Get(':id')
  getDetail(@Param('id',ParseIntPipe) id: number) {
    return this.transactionService.getDetail(id);
  }
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('paymentImage', {
      storage: storageConfig('paymentImage'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.jpeg'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError = `Wrong file size. Accepted file size is than 5MB`;
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  async update( @Req() req: any,
  @UploadedFile() file: Express.Multer.File,@Param('id',ParseIntPipe) id: number, @Body() updateTransactionDto: UpdateTransactionDto) {
    if (req.fileValidationError) {
      console.log("bug")
      throw new BadRequestException(req.fileValidationError);
    }
    if(file){
      const fileName = file.fieldname + '/' + file.filename;
      updateTransactionDto.paymentImage = fileName
    }else{
      updateTransactionDto.paymentImage = updateTransactionDto.paymentImage
    }
    return await this.transactionService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  async delete(@Param('id',ParseIntPipe) id: number) {
    return await this.transactionService.delete(id);
  }
  @Delete('forceDelete/:id')
  async forceDelete(@Param('id',ParseIntPipe) id: number) {
    return await this.transactionService.forceDelete(+id);
  }
}
