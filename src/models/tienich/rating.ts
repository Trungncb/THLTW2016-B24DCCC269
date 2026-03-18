import { useState } from 'react';

export default () => {
	const [ratingList, setRatingList] = useState<TienIch.Rating[]>([]);
	const [ratingItem, setRatingItem] = useState<TienIch.Rating | undefined>();
	const [ratingVisible, setRatingVisible] = useState<boolean>(false);

	const getDataRating = async () => {
		const dataLocal: any = JSON.parse(localStorage.getItem('rating') as any) || [];
		setRatingList(dataLocal);
	};

	const addRating = (rating: TienIch.Rating) => {
		const newList = [...ratingList, { ...rating, id: Date.now() }];
		localStorage.setItem('rating', JSON.stringify(newList));
		setRatingList(newList);
	};

	const updateRating = (rating: TienIch.Rating) => {
		const newList = ratingList.map(item => (item.id === rating.id ? rating : item));
		localStorage.setItem('rating', JSON.stringify(newList));
		setRatingList(newList);
	};

	const getAverageRating = (staffId?: number, serviceId?: number): number => {
		let ratings = ratingList;
		if (staffId) ratings = ratings.filter(r => r.staffId === staffId);
		if (serviceId) ratings = ratings.filter(r => r.serviceId === serviceId);
		
		if (ratings.length === 0) return 0;
		const total = ratings.reduce((sum, r) => sum + r.score, 0);
		return Math.round((total / ratings.length) * 100) / 100;
	};

	const getStaffRatings = (staffId: number) => {
		return ratingList.filter(r => r.staffId === staffId);
	};

	return {
		ratingList,
		setRatingList,
		getDataRating,
		ratingItem,
		setRatingItem,
		ratingVisible,
		setRatingVisible,
		addRating,
		updateRating,
		getAverageRating,
		getStaffRatings,
	};
};
