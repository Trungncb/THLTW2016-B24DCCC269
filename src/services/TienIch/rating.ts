import axios from '@/utils/axios';

// API endpoints for Rating management
export async function getRatingList() {
	return axios.get('/api/rating');
}

export async function createRating(data: TienIch.Rating) {
	return axios.post('/api/rating', data);
}

export async function updateRating(id: number, data: TienIch.Rating) {
	return axios.put(`/api/rating/${id}`, data);
}

export async function deleteRating(id: number) {
	return axios.delete(`/api/rating/${id}`);
}

export async function getRatingById(id: number) {
	return axios.get(`/api/rating/${id}`);
}

export async function getStaffRatings(staffId: number) {
	return axios.get(`/api/rating/staff/${staffId}`);
}

export async function getStaffAverageRating(staffId: number) {
	return axios.get(`/api/rating/staff/${staffId}/average`);
}

export async function getServiceRatings(serviceId: number) {
	return axios.get(`/api/rating/service/${serviceId}`);
}

export async function replyRating(id: number, reply: string) {
	return axios.post(`/api/rating/${id}/reply`, { reply });
}
