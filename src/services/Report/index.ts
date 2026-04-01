import axios from '@/utils/axios';
import { ReportModel } from '@/models/report';

const API_PREFIX = '/api/reports';

export async function getOverallStatistics(): Promise<ReportModel.StatisticsResponse> {
  const response = await axios.get<ReportModel.StatisticsResponse>(`${API_PREFIX}/statistics`);
  return response.data;
}

export async function getRegistrationByClubChart(): Promise<ReportModel.ChartDataResponse> {
  const response = await axios.get<ReportModel.ChartDataResponse>(`${API_PREFIX}/registrations-by-club`);
  return response.data;
}

export async function getClubStatistics(): Promise<{
  data: { totalClubs: number };
  success: boolean;
}> {
  const response = await axios.get<{ data: { totalClubs: number }; success: boolean }>(`${API_PREFIX}/club-count`);
  return response.data;
}

export async function getRegistrationStatistics(): Promise<{
  data: ReportModel.RegistrationStatistics;
  success: boolean;
}> {
  const response = await axios.get<{ data: ReportModel.RegistrationStatistics; success: boolean }>(`${API_PREFIX}/registration-status-count`);
  return response.data;
}
