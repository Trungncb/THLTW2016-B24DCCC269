import useInitModel from '@/hooks/useInitModel';

/**
 * Quyết Định Tốt Nghiệp - Quản lý các quyết định tốt nghiệp theo đợt
 */
export default () => {
  const objInit = useInitModel<QuyetDinhTotNghiep.IRecord>('quyet-dinh-tot-nghiep');

  return {
    ...objInit,
  };
};

declare global {
  namespace QuyetDinhTotNghiep {
    interface IRecord {
      _id?: string;
      soQD: string; // Số quyết định
      nam: number; // Năm
      dot: number; // Số đợt
      soVanBangId: string; // Reference đến sổ văn bằng
      ngayBanHanh: Date;
      trichYeu: string; // Trích yếu nội dung QĐ
      soHocVienDuDKi: number; // Số học viên dự tính
      soHocVienDat: number; // Số học viên đạt
      ghiChu?: string;
      createdAt?: Date;
      updatedAt?: Date;
    }
  }
}
