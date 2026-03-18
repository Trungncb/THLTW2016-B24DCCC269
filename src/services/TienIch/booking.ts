import axios from '@/utils/axios';

// API endpoints for Booking management
export async function getBookingList() {
	return axios.get('/api/booking');
}

export async function createBooking(data: TienIch.Booking) {
	return axios.post('/api/booking', data);
}

export async function updateBooking(id: number, data: TienIch.Booking) {
	return axios.put(`/api/booking/${id}`, data);
}

export async function deleteBooking(id: number) {
	return axios.delete(`/api/booking/${id}`);
}

export async function getBookingById(id: number) {
	return axios.get(`/api/booking/${id}`);
}

export async function getBookingByStaffId(staffId: number, date?: string) {
	const params = new URLSearchParams();
	params.append('staffId', staffId.toString());
	if (date) params.append('date', date);
	return axios.get(`/api/booking?${params.toString()}`);
}

export async function checkConflict(staffId: number, date: string, startTime: string, endTime: string) {
	return axios.post('/api/booking/check-conflict', { staffId, date, startTime, endTime });
}
