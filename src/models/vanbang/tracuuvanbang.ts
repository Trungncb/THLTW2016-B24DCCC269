import useInitModel from '@/hooks/useInitModel';

/**
 * Tra cứu Văn Bằng - Ghi nhận số lượt tra cứu
 */
export default () => {
  const objInit = useInitModel<TraCuuVanBang.IRecord>('tra-cuu-van-bang');

  return {
    ...objInit,
  };
};

declare global {
  namespace TraCuuVanBang {
    interface ISearchParams {
      soHieuVanBang?: string;
      soVaoSo?: number;
      maSinhVien?: string;
      hoTen?: string;
      ngaySinh?: Date;
    }

    interface IRecord {
      _id?: string;
      thongTinVanBangId: string; // Reference đến thông tin văn bằng
      quyetDinhId: string; // Reference đến quyết định tốt nghiệp
      thoiGianTraCuu: Date;
      nguoiTraCuu?: string;
      soHieuVanBang?: string;
      hoTen?: string;
      createdAt?: Date;
    }

    interface ITraCuuResult {
      tongSoLuotTraCuu: number;
      chiTiet: Array<{
        quyetDinhId: string;
        soQD: string;
        soLuot: number;
      }>;
    }
  }
}
