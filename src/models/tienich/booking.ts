import { useState } from 'react';

export default () => {
	const [bookingList, setBookingList] = useState<TienIch.Booking[]>([]);
	const [bookingItem, setBookingItem] = useState<TienIch.Booking | undefined>();
	const [isEditBooking, setIsEditBooking] = useState<boolean>(false);
	const [bookingVisible, setBookingVisible] = useState<boolean>(false);

	const getDataBooking = async () => {
		const dataLocal: any = JSON.parse(localStorage.getItem('booking') as any) || [];
		setBookingList(dataLocal);
	};

	const addBooking = (booking: TienIch.Booking) => {
		const newList = [...bookingList, { ...booking, id: Date.now() }];
		localStorage.setItem('booking', JSON.stringify(newList));
		setBookingList(newList);
	};

	const updateBooking = (booking: TienIch.Booking) => {
		const newList = bookingList.map(item => (item.id === booking.id ? booking : item));
		localStorage.setItem('booking', JSON.stringify(newList));
		setBookingList(newList);
	};

	const deleteBooking = (id: number) => {
		const newList = bookingList.filter(item => item.id !== id);
		localStorage.setItem('booking', JSON.stringify(newList));
		setBookingList(newList);
	};

	const checkConflict = (staffId: number, date: string, startTime: string, endTime: string, excludeId?: number): boolean => {
		const bookings = bookingList.filter(b => {
			if (excludeId && b.id === excludeId) return false;
			if (b.staffId !== staffId || b.date !== date) return false;
			if (b.status === 'cancelled') return false;
			
			const newStart = new Date(`${date}T${startTime}`).getTime();
			const newEnd = new Date(`${date}T${endTime}`).getTime();
			const existStart = new Date(`${b.date}T${b.startTime}`).getTime();
			const existEnd = new Date(`${b.date}T${b.endTime}`).getTime();
			
			return newStart < existEnd && newEnd > existStart;
		});
		
		return bookings.length > 0;
	};

	return {
		bookingList,
		setBookingList,
		getDataBooking,
		bookingItem,
		setBookingItem,
		isEditBooking,
		setIsEditBooking,
		bookingVisible,
		setBookingVisible,
		addBooking,
		updateBooking,
		deleteBooking,
		checkConflict,
	};
};
