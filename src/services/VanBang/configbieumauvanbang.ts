import { request } from 'umi';

const API_BASE = '/api/config-bieu-mau-van-bang';

export const queryConfigBieuMau = async (
  params: Record<string, any> = {}
): Promise<API.ListResponse<ConfigBieuMauVanBang.IRecord>> => {
  return request(`${API_BASE}`, {
    method: 'GET',
    params,
  });
};

export const getConfigBieuMau = async (id: string): Promise<ConfigBieuMauVanBang.IRecord> => {
  return request(`${API_BASE}/${id}`, {
    method: 'GET',
  });
};

export const createConfigBieuMau = async (
  data: Partial<ConfigBieuMauVanBang.IRecord>
): Promise<ConfigBieuMauVanBang.IRecord> => {
  return request(`${API_BASE}`, {
    method: 'POST',
    data,
  });
};

export const updateConfigBieuMau = async (
  id: string,
  data: Partial<ConfigBieuMauVanBang.IRecord>
): Promise<ConfigBieuMauVanBang.IRecord> => {
  return request(`${API_BASE}/${id}`, {
    method: 'PUT',
    data,
  });
};

export const deleteConfigBieuMau = async (id: string): Promise<any> => {
  return request(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
};

export const getConfigHienTai = async (): Promise<ConfigBieuMauVanBang.IRecord> => {
  return request(`${API_BASE}/current`, {
    method: 'GET',
  });
};
