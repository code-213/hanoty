export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class PaginationHelper {
  static getOffset(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  static getTotalPages(total: number, limit: number): number {
    return Math.ceil(total / limit);
  }

  static createResponse<T>(
    data: T[],
    total: number,
    page: number,
    limit: number
  ): PaginationResult<T> {
    const totalPages = this.getTotalPages(total, limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  static validateParams(page: any, limit: any): PaginationParams {
    const validPage = Math.max(1, parseInt(page) || 1);
    const validLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));

    return {
      page: validPage,
      limit: validLimit,
    };
  }
}
