import axios from '@/utils/axios';

// API endpoints for Staff management
export async function getStaffList() {
	return axios.get('/api/staff');
}

export async function createStaff(data: TienIch.Staff) {
	return axios.post('/api/staff', data);
}

export async function updateStaff(id: number, data: TienIch.Staff) {
	return axios.put(`/api/staff/${id}`, data);
}

export async function deleteStaff(id: number) {
	return axios.delete(`/api/staff/${id}`);
}

export async function getStaffById(id: number) {
	return axios.get(`/api/staff/${id}`);
}
