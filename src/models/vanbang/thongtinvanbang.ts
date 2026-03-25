import useInitModel from '@/hooks/useInitModel';

/**
 * Thông Tin Văn Bằng - Quản lý thông tin bằng tốt nghiệp của từng sinh viên
 */
export default () => {
  const objInit = useInitModel<ThongTinVanBang.IRecord>('thong-tin-van-bang');

  return {
    ...objInit,
  };
};

declare global {
  namespace ThongTinVanBang {
    interface IRecord {
      _id?: string;
      soVanBangId: string; // Reference đến sổ văn bằng
      quyetDinhId: string; // Reference đến quyết định
      soVaoSo: number; // Số vào sổ - tự động tăng, không chỉnh sửa
      soHieuVanBang: string; // Số hiệu văn bằng
      maSinhVien: string; // Mã sinh viên
      hoTen: string; // Họ tên
      ngaySinh: Date; // Ngày sinh (mặc định)
      gioiTinh?: string;
      danToc?: string;
      noiSinh?: string;
      diemTrungBinh?: number;
      xepHang?: string;
      heDaoTao?: string;
      // Các trường động từ cấu hình biểu mẫu
      cacTruongDong?: Record<string, any>;
      ngayTao?: Date;
      createdAt?: Date;
      updatedAt?: Date;
    }
  }
}
