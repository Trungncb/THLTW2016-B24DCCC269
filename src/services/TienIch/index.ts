import axios from '@/utils/axios';

// API endpoints for Statistics
export async function getBookingStatistics(startDate?: string, endDate?: string) {
	const params = new URLSearchParams();
	if (startDate) params.append('startDate', startDate);
	if (endDate) params.append('endDate', endDate);
	return axios.get(`/api/statistics/booking?${params.toString()}`);
}

export async function getRevenueStatistics(startDate?: string, endDate?: string) {
	const params = new URLSearchParams();
	if (startDate) params.append('startDate', startDate);
	if (endDate) params.append('endDate', endDate);
	return axios.get(`/api/statistics/revenue?${params.toString()}`);
}

export async function getServiceStatistics(startDate?: string, endDate?: string) {
	const params = new URLSearchParams();
	if (startDate) params.append('startDate', startDate);
	if (endDate) params.append('endDate', endDate);
	return axios.get(`/api/statistics/service?${params.toString()}`);
}

export async function getStaffStatistics(startDate?: string, endDate?: string) {
	const params = new URLSearchParams();
	if (startDate) params.append('startDate', startDate);
	if (endDate) params.append('endDate', endDate);
	return axios.get(`/api/statistics/staff?${params.toString()}`);
}
