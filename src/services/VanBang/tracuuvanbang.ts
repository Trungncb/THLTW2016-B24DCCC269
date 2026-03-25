import { request } from 'umi';

const API_BASE = '/api/tra-cuu-van-bang';

export const traCuuVanBang = async (
  params: TraCuuVanBang.ISearchParams
): Promise<API.ListResponse<ThongTinVanBang.IRecord>> => {
  return request(`${API_BASE}/search`, {
    method: 'GET',
    params,
  });
};

export const getThongKeTrachuu = async (quyetDinhId?: string): Promise<TraCuuVanBang.ITraCuuResult> => {
  return request(`${API_BASE}/thong-ke`, {
    method: 'GET',
    params: { quyetDinhId },
  });
};

export const recordTraCuu = async (
  thongTinVanBangId: string,
  params?: Record<string, any>
): Promise<TraCuuVanBang.IRecord> => {
  return request(`${API_BASE}`, {
    method: 'POST',
    data: {
      thongTinVanBangId,
      ...params,
    },
  });
};
