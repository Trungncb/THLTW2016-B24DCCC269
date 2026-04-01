import axios from '@/utils/axios';
import { RegistrationModel } from '@/models/registration';

const API_PREFIX = '/api/registrations';

export async function getRegistrationList(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: RegistrationModel.RegistrationStatus;
  sort?: string;
}): Promise<RegistrationModel.RegistrationListResponse> {
  const response = await axios.get<RegistrationModel.RegistrationListResponse>(`${API_PREFIX}`, { params });
  return response.data;
}

export async function getRegistrationById(id: string): Promise<RegistrationModel.RegistrationResponse> {
  const response = await axios.get<RegistrationModel.RegistrationResponse>(`${API_PREFIX}/${id}`);
  return response.data;
}

export async function createRegistration(
  data: RegistrationModel.CreateRegistrationRequest,
): Promise<RegistrationModel.RegistrationResponse> {
  const response = await axios.post<RegistrationModel.RegistrationResponse>(`${API_PREFIX}`, data);
  return response.data;
}

export async function updateRegistration(
  data: RegistrationModel.UpdateRegistrationRequest,
): Promise<RegistrationModel.RegistrationResponse> {
  const response = await axios.put<RegistrationModel.RegistrationResponse>(`${API_PREFIX}/${data.id}`, data);
  return response.data;
}

export async function deleteRegistration(id: string): Promise<{ success: boolean; message: string }> {
  const response = await axios.delete<{ success: boolean; message: string }>(`${API_PREFIX}/${id}`);
  return response.data;
}

export async function approveRegistrations(
  data: RegistrationModel.ApproveRegistrationRequest,
): Promise<{ success: boolean; message: string; approvedCount: number }> {
  const response = await axios.post<{ success: boolean; message: string; approvedCount: number }>(`${API_PREFIX}/approve-multiple`, data);
  return response.data;
}

export async function rejectRegistrations(
  data: RegistrationModel.RejectRegistrationRequest,
): Promise<{ success: boolean; message: string; rejectedCount: number }> {
  const response = await axios.post<{ success: boolean; message: string; rejectedCount: number }>(`${API_PREFIX}/reject-multiple`, data);
  return response.data;
}

export async function getActionHistory(registrationId: string):
  Promise<RegistrationModel.ActionHistoryListResponse> {
  const response = await axios.get<RegistrationModel.ActionHistoryListResponse>(`${API_PREFIX}/${registrationId}/history`);
  return response.data;
}
