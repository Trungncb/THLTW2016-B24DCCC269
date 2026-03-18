import { useState } from 'react';

export default () => {
	const [serviceList, setServiceList] = useState<TienIch.Service[]>([]);
	const [serviceItem, setServiceItem] = useState<TienIch.Service | undefined>();
	const [isEditService, setIsEditService] = useState<boolean>(false);
	const [serviceVisible, setServiceVisible] = useState<boolean>(false);

	const getDataService = async () => {
		const dataLocal: any = JSON.parse(localStorage.getItem('service') as any) || [];
		setServiceList(dataLocal);
	};

	const addService = (service: TienIch.Service) => {
		const newList = [...serviceList, { ...service, id: Date.now() }];
		localStorage.setItem('service', JSON.stringify(newList));
		setServiceList(newList);
	};

	const updateService = (service: TienIch.Service) => {
		const newList = serviceList.map(item => (item.id === service.id ? service : item));
		localStorage.setItem('service', JSON.stringify(newList));
		setServiceList(newList);
	};

	const deleteService = (id: number) => {
		const newList = serviceList.filter(item => item.id !== id);
		localStorage.setItem('service', JSON.stringify(newList));
		setServiceList(newList);
	};

	return {
		serviceList,
		setServiceList,
		getDataService,
		serviceItem,
		setServiceItem,
		isEditService,
		setIsEditService,
		serviceVisible,
		setServiceVisible,
		addService,
		updateService,
		deleteService,
	};
};
