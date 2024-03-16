export interface CategoryFilterType {
  items_per_page?: number | null;
  page?: number | null;
  search?: string | null;
  nextPage?: number | null;
  previousPage?: number | null;
}
export interface CategoryPaginationResponseType {
  data: { name: string; createdAt: Date }[];
  total: number;
  currentPage: number;
  nextPage?: number;
  previousPage?: number;
  itemsPerPage?: number;
}
