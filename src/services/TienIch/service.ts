import axios from '@/utils/axios';

// API endpoints for Service management
export async function getServiceList() {
	return axios.get('/api/service');
}

export async function createService(data: TienIch.Service) {
	return axios.post('/api/service', data);
}

export async function updateService(id: number, data: TienIch.Service) {
	return axios.put(`/api/service/${id}`, data);
}

export async function deleteService(id: number) {
	return axios.delete(`/api/service/${id}`);
}

export async function getServiceById(id: number) {
	return axios.get(`/api/service/${id}`);
}
