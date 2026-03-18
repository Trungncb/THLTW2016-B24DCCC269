import { useState } from 'react';

export default () => {
	const [staffList, setStaffList] = useState<TienIch.Staff[]>([]);
	const [staffItem, setStaffItem] = useState<TienIch.Staff | undefined>();
	const [isEditStaff, setIsEditStaff] = useState<boolean>(false);
	const [staffVisible, setStaffVisible] = useState<boolean>(false);

	const getDataStaff = async () => {
		const dataLocal: any = JSON.parse(localStorage.getItem('staff') as any) || [];
		setStaffList(dataLocal);
	};

	const addStaff = (staff: TienIch.Staff) => {
		const newList = [...staffList, { ...staff, id: Date.now() }];
		localStorage.setItem('staff', JSON.stringify(newList));
		setStaffList(newList);
	};

	const updateStaff = (staff: TienIch.Staff) => {
		const newList = staffList.map(item => (item.id === staff.id ? staff : item));
		localStorage.setItem('staff', JSON.stringify(newList));
		setStaffList(newList);
	};

	const deleteStaff = (id: number) => {
		const newList = staffList.filter(item => item.id !== id);
		localStorage.setItem('staff', JSON.stringify(newList));
		setStaffList(newList);
	};

	return {
		staffList,
		setStaffList,
		getDataStaff,
		staffItem,
		setStaffItem,
		isEditStaff,
		setIsEditStaff,
		staffVisible,
		setStaffVisible,
		addStaff,
		updateStaff,
		deleteStaff,
	};
};
