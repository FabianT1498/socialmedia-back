import { Query } from 'mongoose';

import PaginationResult from './types/paginate.interface';

export async function paginate<T>(
  query: Query<T[], T>,
  page: number,
  pageSize: number
): Promise<PaginationResult<T>> {
  const offset = (page - 1) * pageSize;

  const results = await query.skip(offset).limit(pageSize);
  const total = await query.clone().countDocuments();

  const totalPages = Math.ceil(total / pageSize);

  return {
    results,
    total,
    totalPages,
    currentPage: page,
  };
}
