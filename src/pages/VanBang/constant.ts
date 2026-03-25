// Constants for VanBang module

export const TRANG_THAI_SO_VAN_BANG = {
  MO: 'MO',
  DONG: 'DONG',
};

export const TRANG_THAI_SO_VAN_BANG_LABEL = {
  [TRANG_THAI_SO_VAN_BANG.MO]: 'Mở',
  [TRANG_THAI_SO_VAN_BANG.DONG]: 'Đóng',
};

export const KIEU_DU_LIEU = {
  STRING: 'STRING',
  NUMBER: 'NUMBER',
  DATE: 'DATE',
};

export const KIEU_DU_LIEU_LABEL = {
  [KIEU_DU_LIEU.STRING]: 'Ký tự',
  [KIEU_DU_LIEU.NUMBER]: 'Số',
  [KIEU_DU_LIEU.DATE]: 'Ngày',
};

export const DEFAULT_FIELDS = [
  'soVaoSo',
  'soHieuVanBang',
  'maSinhVien',
  'hoTen',
  'ngaySinh',
];

export const DEFAULT_FIELDS_LABEL: Record<string, string> = {
  soVaoSo: 'Số vào sổ',
  soHieuVanBang: 'Số hiệu văn bằng',
  maSinhVien: 'Mã sinh viên',
  hoTen: 'Họ tên',
  ngaySinh: 'Ngày sinh',
};
