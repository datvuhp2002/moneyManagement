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
  ParseArrayPipe,
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
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Post()
  @Roles([Role.Admin])
  create(@Body() body: CreateUserDto): Promise<User> {
    console.log('create user api', body);
    return this.userService.create(body);
  }
  @Get()
  @Roles([Role.Admin])
  getAll(@Query() params: UserFilterType): Promise<UserPaginationResponseType> {
    console.log('get all user api', params);
    return this.userService.getAll(params);
  }
 
  @Get(':id')
  @Roles([Role.Admin])
  getDetail(@Param('id', ParseIntPipe) id: number): Promise<User> {
    console.log('get detail user api =>', id);
    return this.userService.getDetail(id);
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
  @Delete(':id')
  @Roles([Role.Admin])
  deleteById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SoftDeleteUserDto> {
    console.log('delete user => ', id);
    return this.userService.deleteById(id);
  }
  @Delete('multiple')
  @Roles([Role.Admin])
  multipleDelete(
    @Query('ids', new ParseArrayPipe({ items: String, separator: ',' }))
    ids: string[],
  ) {
    return this.userService.multipleDelete(ids);
  }
  @Post('upload-avatar')
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

}
