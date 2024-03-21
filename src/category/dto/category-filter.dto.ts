import { Category } from "@prisma/client";
export interface CategoryFilterType {
  categoriesGroup_id:number;
}
export interface CategoryPaginationResponseType {
  data: Category[];
  total: number;
}
