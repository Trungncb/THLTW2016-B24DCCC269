import useInitModel from '@/hooks/useInitModel';

/**
 * Sổ Văn Bằng - Quản lý sổ cấp bằng tôt nghiệp hàng năm
 */
export default () => {
  const objInit = useInitModel<SoVanBang.IRecord>('so-van-bang');

  return {
    ...objInit,
  };
};

declare global {
  namespace SoVanBang {
    interface IRecord {
      _id?: string;
      nam: number; // Năm
      soThuTu: number; // Số thứ tự sổ
      soDangMo: number; // Số dòng đã được cấp
      trangThaiMo: 'MO' | 'DONG'; // Trạng thái: mở hoặc đóng
      ngayMo: Date;
      ngayDong?: Date;
      ghiChu?: string;
      createdAt?: Date;
      updatedAt?: Date;
    }
  }
}
