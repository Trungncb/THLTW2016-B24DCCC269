import { request } from 'umi';

const API_BASE = '/api/quyet-dinh-tot-nghiep';

export const queryQuyetDinhTotNghiep = async (
  params: Record<string, any> = {}
): Promise<API.ListResponse<QuyetDinhTotNghiep.IRecord>> => {
  return request(`${API_BASE}`, {
    method: 'GET',
    params,
  });
};

export const getQuyetDinhTotNghiep = async (id: string): Promise<QuyetDinhTotNghiep.IRecord> => {
  return request(`${API_BASE}/${id}`, {
    method: 'GET',
  });
};

export const createQuyetDinhTotNghiep = async (
  data: Partial<QuyetDinhTotNghiep.IRecord>
): Promise<QuyetDinhTotNghiep.IRecord> => {
  return request(`${API_BASE}`, {
    method: 'POST',
    data,
  });
};

export const updateQuyetDinhTotNghiep = async (
  id: string,
  data: Partial<QuyetDinhTotNghiep.IRecord>
): Promise<QuyetDinhTotNghiep.IRecord> => {
  return request(`${API_BASE}/${id}`, {
    method: 'PUT',
    data,
  });
};

export const deleteQuyetDinhTotNghiep = async (id: string): Promise<any> => {
  return request(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
};
