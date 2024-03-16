export interface RoleFilterType {
  items_per_page?: number;
  page?: number;
  search?: string;
  nextPage?: number;
  previousPage?: number;
}
export interface RolePaginationResponseType {
  data: { name: string; createdAt: Date }[];
  total: number;
  currentPage: number;
  nextPage?: number;
  previousPage?: number;
  itemsPerPage?: number;
}
export class UpdateRoleDto {
  username: string;
  avatar?: string;
}

export class SoftDeleteRoleDto {
  deleteMark: boolean;
  deletedAt: Date;
}
