import {
  IsEmail,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
export interface UserFilterType {
  items_per_page?: number;
  page?: number;
  search?: string;
  nextPage?: number;
  previousPage?: number;
}
export interface UserPaginationResponseType {
  data: { username: string; email: string; avatar: string; createdAt: Date }[];
  total: number;
  currentPage: number;
  nextPage?: number;
  previousPage?: number;
  itemsPerPage?: number;
}
export class DetailUser{
  username: string
  email:string
  name:string
  phone:string
  note:string
  avatar:string
}
export class UpdateUserDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  phone?:string;
  name?:string;
}
export class SoftDeleteUserDto {
  deleteMark: boolean;
  deletedAt: Date;
}
export class UploadAvatarResult {
  @IsNotEmpty()
  avatar: string;
}
