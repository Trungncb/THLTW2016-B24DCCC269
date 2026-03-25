import { request } from 'umi';

const API_BASE = '/api/so-van-bang';

export const querySoVanBang = async (
  params: Record<string, any> = {}
): Promise<API.ListResponse<SoVanBang.IRecord>> => {
  return request(`${API_BASE}`, {
    method: 'GET',
    params,
  });
};

export const getSoVanBang = async (id: string): Promise<SoVanBang.IRecord> => {
  return request(`${API_BASE}/${id}`, {
    method: 'GET',
  });
};

export const createSoVanBang = async (data: Partial<SoVanBang.IRecord>): Promise<SoVanBang.IRecord> => {
  return request(`${API_BASE}`, {
    method: 'POST',
    data,
  });
};

export const updateSoVanBang = async (
  id: string,
  data: Partial<SoVanBang.IRecord>
): Promise<SoVanBang.IRecord> => {
  return request(`${API_BASE}/${id}`, {
    method: 'PUT',
    data,
  });
};

export const deleteSoVanBang = async (id: string): Promise<any> => {
  return request(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
};

export const openSoVanBang = async (nam: number): Promise<SoVanBang.IRecord> => {
  return request(`${API_BASE}/open/${nam}`, {
    method: 'POST',
  });
};

export const closeSoVanBang = async (id: string): Promise<SoVanBang.IRecord> => {
  return request(`${API_BASE}/${id}/close`, {
    method: 'PUT',
  });
};
