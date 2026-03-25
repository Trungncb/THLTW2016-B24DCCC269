// Re-export các typings từ vanbang models
export * from '../models/vanbang/sovanbang';
export * from '../models/vanbang/quyetdinhtotghiep';
export * from '../models/vanbang/configbieumauvanbang';
export * from '../models/vanbang/thongtinvanbang';
export * from '../models/vanbang/tracuuvanbang';

declare global {
  namespace API {
    interface ListResponse<T = any> {
      data: T[];
      total: number;
      pageNum?: number;
      pageSize?: number;
      totalPage?: number;
    }

    interface ApiResponse<T = any> {
      code: number;
      message: string;
      data?: T;
    }
  }
}
