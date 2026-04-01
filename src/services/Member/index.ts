import axios from '@/utils/axios';
import { MemberModel } from '@/models/member';

const API_PREFIX = '/api/members';

export async function getMemberListByClub(clubId: string, params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
}): Promise<MemberModel.MemberListResponse> {
  const response = await axios.get<MemberModel.MemberListResponse>(`${API_PREFIX}`, { params: { ...params, clubId } });
  return response.data;
}

export async function getMemberById(id: string): Promise<{ data: MemberModel.Member; success: boolean }> {
  const response = await axios.get<{ data: MemberModel.Member; success: boolean }>(`${API_PREFIX}/${id}`);
  return response.data;
}

export async function transferMembers(
  data: MemberModel.TransferMembersRequest,
): Promise<MemberModel.MemberTransferResponse> {
  const response = await axios.post<MemberModel.MemberTransferResponse>(`${API_PREFIX}/transfer-club`, data);
  return response.data;
}

export async function removeMember(id: string): Promise<{ success: boolean; message: string }> {
  const response = await axios.delete<{ success: boolean; message: string }>(`${API_PREFIX}/${id}`);
  return response.data;
}

export async function getClubMembers(clubId: string, params?: {
  page?: number;
  pageSize?: number;
}): Promise<MemberModel.MemberListResponse> {
  const response = await axios.get<MemberModel.MemberListResponse>(`/api/clubs/${clubId}/members`, { params });
  return response.data;
}
