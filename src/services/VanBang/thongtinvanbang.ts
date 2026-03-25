import { request } from 'umi';

const API_BASE = '/api/thong-tin-van-bang';

export const queryThongTinVanBang = async (
  params: Record<string, any> = {}
): Promise<API.ListResponse<ThongTinVanBang.IRecord>> => {
  return request(`${API_BASE}`, {
    method: 'GET',
    params,
  });
};

export const getThongTinVanBang = async (id: string): Promise<ThongTinVanBang.IRecord> => {
  return request(`${API_BASE}/${id}`, {
    method: 'GET',
  });
};

export const createThongTinVanBang = async (
  data: Partial<ThongTinVanBang.IRecord>
): Promise<ThongTinVanBang.IRecord> => {
  return request(`${API_BASE}`, {
    method: 'POST',
    data,
  });
};

export const updateThongTinVanBang = async (
  id: string,
  data: Partial<ThongTinVanBang.IRecord>
): Promise<ThongTinVanBang.IRecord> => {
  return request(`${API_BASE}/${id}`, {
    method: 'PUT',
    data,
  });
};

export const deleteThongTinVanBang = async (id: string): Promise<any> => {
  return request(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
};

export const importThongTinVanBang = async (
  file: File,
  quyetDinhId: string
): Promise<API.ApiResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('quyetDinhId', quyetDinhId);

  return request(`${API_BASE}/import`, {
    method: 'POST',
    data: formData,
  });
};

export const exportThongTinVanBang = async (quyetDinhId: string): Promise<Blob> => {
  return request(`${API_BASE}/export/${quyetDinhId}`, {
    method: 'GET',
    responseType: 'blob',
  });
};
