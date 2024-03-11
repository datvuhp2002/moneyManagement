import {
  Controller,
  Query,
  Get,
  Post,
  Put,
  ParseIntPipe,
  Param,
  Body,
  Delete,
  Req,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  SoftDeleteUserDto,
  UpdateUserDto,
  UploadAvatarResult,
  UserFilterType,
  UserPaginationResponseType,
} from './dto/user.dto';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/dto/Role.enum';
import { Request } from 'express';
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Post()
  @Roles([Role.Admin])
  create(@Body() body: CreateUserDto): Promise<User> {
    return this.userService.create(body);
  }
  @Get('trash')
  @Roles([Role.Admin])
  trash(@Query() params: UserFilterType): Promise<UserPaginationResponseType> {
    console.log('get all user api', params);
    return this.userService.trash(params);
  }
  @Get()
  @Roles([Role.Admin])
  getAll(@Query() params: UserFilterType): Promise<UserPaginationResponseType> {
    console.log('get all user api', params);
    return this.userService.getAll(params);
  }
  @Get('profile')
  @Roles([Role.Admin,Role.User])
  async getProfile(@Req() req:Request):Promise<User>{
    const userId = Number(req.user['id'])
    return await this.userService.getDetail(userId);
  }
  @Get(':id')
  @Roles([Role.Admin])
  getDetail(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.getDetail(id);
  }
  @Put('upload-avatar')
  @Roles([Role.Admin, Role.User])
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: storageConfig('avatar'),
      // validate file before upload
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
  @Roles([Role.Admin, Role.User])
  uploadAvatar(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadAvatarResult> {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.userService.uploadAvatar(
      req.user.id,
      file.fieldname + '/' + file.filename,
    );
  }
  @Put(':id')
  @Roles([Role.Admin])
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    console.log('update user api =>', id);
    return this.userService.update(id, body);
  }
  @Put()
  @Roles([Role.Admin, Role.User])
  updateForUser(
    @Req() req:Request,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    const userId = Number(req.user['id'])
    console.log('update user api =>', userId);
    return this.userService.update(userId, body);
  }
  @Delete(':id')
  @Roles([Role.Admin])
  deleteById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SoftDeleteUserDto> {
    console.log('delete user => ', id);
    return this.userService.deleteById(id);
  }

}
