import useInitModel from '@/hooks/useInitModel';

/**
 * Cấu hình Biểu Mẫu Văn Bằng - Cấu hình các trường thông tin trong biểu mẫu
 */
export default () => {
  const objInit = useInitModel<ConfigBieuMauVanBang.IRecord>('config-bieu-mau-van-bang');

  return {
    ...objInit,
  };
};

declare global {
  namespace ConfigBieuMauVanBang {
    type DataType = 'STRING' | 'NUMBER' | 'DATE';

    interface IField {
      _id?: string;
      ten: string; // Tên trường
      kieuDuLieu: DataType; // Kiểu dữ liệu
      doBatBuoc?: boolean; // Bắt buộc hay không
      thuTu: number; // Thứ tự hiển thị
    }

    interface IRecord {
      _id?: string;
      ten: string; // Tên biểu mẫu
      mieuTa?: string;
      cacTruong: IField[]; // Danh sách các trường
      trangThaiSuDung: boolean; // Trạng thái sử dụng
      createdAt?: Date;
      updatedAt?: Date;
    }
  }
}
