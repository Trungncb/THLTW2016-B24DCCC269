import axios from '@/utils/axios';
import { ClubModel } from '@/models/club';

const API_PREFIX = '/api/clubs';

export async function getClubList(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
}): Promise<ClubModel.ClubListResponse> {
  const response = await axios.get<ClubModel.ClubListResponse>(`${API_PREFIX}`, { params });
  return response.data;
}

export async function getClubById(id: string): Promise<ClubModel.ClubResponse> {
  const response = await axios.get<ClubModel.ClubResponse>(`${API_PREFIX}/${id}`);
  return response.data;
}

export async function createClub(data: ClubModel.CreateClubRequest): Promise<ClubModel.ClubResponse> {
  const response = await axios.post<ClubModel.ClubResponse>(`${API_PREFIX}`, data);
  return response.data;
}

export async function updateClub(data: ClubModel.UpdateClubRequest): Promise<ClubModel.ClubResponse> {
  const response = await axios.put<ClubModel.ClubResponse>(`${API_PREFIX}/${data.id}`, data);
  return response.data;
}

export async function deleteClub(id: string): Promise<{ success: boolean; message: string }> {
  const response = await axios.delete<{ success: boolean; message: string }>(`${API_PREFIX}/${id}`);
  return response.data;
}

export async function getClubMembers(clubId: string, params?: {
  page?: number;
  pageSize?: number;
}): Promise<any> {
  const response = await axios.get(`${API_PREFIX}/${clubId}/members`, { params });
  return response.data;
}
