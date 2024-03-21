import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UploadedFile,
  BadRequestException,
  UseInterceptors,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Request } from 'express';
import {
  TransactionPaginationResponseType,
} from './dto/filter-type.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/dto/Role.enum';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { getUser } from 'src/user/decorator/user.decorator';
import { UploadPaymentImageDto } from './dto/upload-paymentImage.dto';
@ApiBearerAuth()
@ApiTags('Transaction')
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
    @UploadedFile() file: Express.Multer.File,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    if (req.fileValidationError) {
      console.log('bug');
      throw new BadRequestException(req.fileValidationError);
    }
    if (file) {
      createTransactionDto.paymentImage = file.fieldname + '/' + file.filename;
    } else {
      createTransactionDto.paymentImage = null;
    }
    const userId = Number(req.user['id']);
    return await this.transactionService.create(userId, createTransactionDto);
  }
  @Put('upload-paymentImage/:id')
  @Roles([Role.Admin, Role.User])
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
  updatePaymentImage(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadPaymentImageDto> {
    console.log(id)
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.transactionService.uploadPaymentImage(
      id,
      file.fieldname + '/' + file.filename,
    );
  }
  @Roles([Role.Admin])
  @Get()
  async getAll(
  ): Promise<TransactionPaginationResponseType> {
    return await this.transactionService.getAll();
  }
  @Roles([Role.Admin])
  @Get('trash')
  async trash(
  ): Promise<TransactionPaginationResponseType> {
    return await this.transactionService.trash();
  }
  @Roles([Role.User, Role.Admin])
  @Get('getAll')
  async getAllForUser(
    @getUser() user,
  ): Promise<TransactionPaginationResponseType> {
    const userId = Number(user.id);
    return await this.transactionService.getAllForUser(userId);
  }
  @Get(':id')
  @Roles([ Role.Admin])
  getDetail(@Param('id', ParseIntPipe) id: number) {
    return this.transactionService.getDetail(id);
  }
  @Get('detail/:id')
  @Roles([ Role.Admin, Role.User])
  getDetailForUser(@getUser() user,@Param('id', ParseIntPipe) id: number) {
    const userId = Number(user.id)
    return this.transactionService.getDetailForUser(userId,id);
  }
 
  @Put(':id')
  async update(
    @getUser() user,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    console.log("update ==== ",updateTransactionDto)
    const userId = Number(user.id);
    return await this.transactionService.update(userId,id, updateTransactionDto);
  }

  @Delete(':id')
  async delete(@getUser()user,@Param('id', ParseIntPipe) id: number) {
    const userId = Number(user.id)
    return await this.transactionService.delete(userId,id);
  }
  @Delete('forceDelete/:id')
  async forceDelete(@Param('id', ParseIntPipe) id: number) {
    return await this.transactionService.forceDelete(+id);
  }
}
