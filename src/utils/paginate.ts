import { Query } from "mongoose";

import PaginationResult from "./types/paginate.interface";

export async function paginate<T>(
  query: Query<T[], T>,
  page: number,
  pageSize: number
): Promise<PaginationResult<T>> {
  const offset = (page - 1) * pageSize;

  const [results, total] = await Promise.all([
    query.skip(offset).limit(pageSize),
    query.countDocuments(),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return {
    results,
    total,
    totalPages,
    currentPage: page,
  };
}
