import React, { useEffect } from 'react';
import { Table, Button, Form, Input, Space, Popconfirm, message, Drawer, Select, DatePicker, TimePicker, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useBooking } from '@/models/tienich';
import dayjs from 'dayjs';

const BookingManagement: React.FC = () => {
	const { bookingList, getDataBooking, addBooking, updateBooking, deleteBooking, checkConflict, bookingItem, setBookingItem, bookingVisible, setBookingVisible, isEditBooking, setIsEditBooking } = useBooking();
	const [form] = Form.useForm();
	const [staffList, setStaffList] = React.useState<TienIch.Staff[]>([]);
	const [serviceList, setServiceList] = React.useState<TienIch.Service[]>([]);

	useEffect(() => {
		getDataBooking();
		const staffData = JSON.parse(localStorage.getItem('staff') as any) || [];
		const serviceData = JSON.parse(localStorage.getItem('service') as any) || [];
		setStaffList(staffData);
		setServiceList(serviceData);
	}, []);

	// Trigger form reset when drawer opens/closes
	useEffect(() => {
		if (!bookingVisible) {
			form.resetFields();
			setBookingItem(undefined);
			setIsEditBooking(false);
		}
	}, [bookingVisible]);

	const handleAdd = () => {
		setBookingItem(undefined);
		setIsEditBooking(false);
		form.resetFields();
		setBookingVisible(true);
	};

	const handleEdit = (record: TienIch.Booking) => {
		setBookingItem(record);
		setIsEditBooking(true);
		form.setFieldsValue({
			...record,
			date: dayjs(record.date),
			startTime: dayjs(record.startTime, 'HH:mm'),
			endTime: dayjs(record.endTime, 'HH:mm'),
		});
		setBookingVisible(true);
	};

	const handleDelete = (id: number | undefined) => {
		if (id) {
			deleteBooking(id);
			message.success('Xóa lịch hẹn thành công');
			getDataBooking(); // Refresh data
		}
	};

	const handleCloseDrawer = () => {
		form.resetFields();
		setBookingItem(undefined);
		setIsEditBooking(false);
		setBookingVisible(false);
	};

	const handleSubmit = async (values: any) => {
		const booking: TienIch.Booking = {
			...values,
			date: values.date.format('YYYY-MM-DD'),
			startTime: values.startTime.format('HH:mm'),
			endTime: values.endTime.format('HH:mm'),
		};

		if (isEditBooking && bookingItem?.id) {
			booking.id = bookingItem.id;
			const isConflict = checkConflict(booking.staffId, booking.date, booking.startTime, booking.endTime, bookingItem.id);
			if (isConflict) {
				message.error('Lịch của nhân viên này bị trùng!');
				return;
			}
			updateBooking(booking);
			message.success('Cập nhật lịch hẹn thành công');
		} else {
			const isConflict = checkConflict(booking.staffId, booking.date, booking.startTime, booking.endTime);
			if (isConflict) {
				message.error('Lịch của nhân viên này bị trùng!');
				return;
			}
			addBooking(booking);
			message.success('Thêm lịch hẹn thành công');
		}
		getDataBooking(); // Refresh data
		handleCloseDrawer();
	};

	const statusColors = {
		pending: 'default',
		confirmed: 'processing',
		completed: 'success',
		cancelled: 'error',
	};

	const statusNames = {
		pending: 'Chờ xác nhận',
		confirmed: 'Đã xác nhận',
		completed: 'Hoàn thành',
		cancelled: 'Đã hủy',
	};

	const columns = [
		{
			title: 'Khách hàng',
			dataIndex: 'customerName',
			key: 'customerName',
		},
		{
			title: 'Điện thoại',
			dataIndex: 'customerPhone',
			key: 'customerPhone',
		},
		{
			title: 'Nhân viên',
			dataIndex: 'staffId',
			key: 'staffId',
			render: (staffId: number) => staffList.find(s => s.id === staffId)?.name || 'N/A',
		},
		{
			title: 'Ngày',
			dataIndex: 'date',
			key: 'date',
		},
		{
			title: 'Giờ',
			key: 'time',
			render: (_: any, record: TienIch.Booking) => `${record.startTime} - ${record.endTime}`,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			render: (status: string) => (
				<Tag color={statusColors[status as keyof typeof statusColors]}>
					{statusNames[status as keyof typeof statusNames]}
				</Tag>
			),
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: TienIch.Booking) => (
				<Space>
					<Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
					<Popconfirm title="Bạn chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.id)}>
						<Button danger size="small" icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div>
			<div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<div>
					<h2 style={{ margin: '0 0 5px 0', color: '#1890ff' }}>Danh sách đặt lịch</h2>
					<p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Quản lý lịch hẹn của khách hàng</p>
				</div>
				<Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleAdd}>
					+ Đặt lịch mới
				</Button>
			</div>

			<div style={{ 
				backgroundColor: '#fff',
				borderRadius: '8px',
				boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
				overflow: 'hidden',
				padding: '20px'
			}}>
				<Table
					columns={columns}
					dataSource={bookingList}
					rowKey="id"
					pagination={{ pageSize: 10 }}
					bordered
					style={{ borderRadius: '4px' }}
				/>
			</div>

			<Drawer
				title={isEditBooking ? <span><EditOutlined /> Sửa lịch hẹn</span> : <span><PlusOutlined /> Đặt lịch hẹn mới</span>}
				placement="right"
				onClose={handleCloseDrawer}
				visible={bookingVisible}
				width={450}
			>
				<Form
					form={form}
					onFinish={handleSubmit}
					layout="vertical"
				>
					<Form.Item
						name="customerName"
						label="Tên khách hàng"
						rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
					>
						<Input placeholder="Nhập tên khách hàng" />
					</Form.Item>

					<Form.Item
						name="customerPhone"
						label="Số điện thoại"
						rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
					>
						<Input placeholder="Nhập số điện thoại" />
					</Form.Item>

					<Form.Item
						name="staffId"
						label="Nhân viên"
						rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
					>
						<Select placeholder="Chọn nhân viên">
							{staffList.map(staff => (
								<Select.Option key={staff.id} value={staff.id}>
									{staff.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item
						name="serviceId"
						label="Dịch vụ"
						rules={[{ required: true, message: 'Vui lòng chọn dịch vụ' }]}
					>
						<Select placeholder="Chọn dịch vụ">
							{serviceList.map(service => (
								<Select.Option key={service.id} value={service.id}>
									{service.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item
						name="date"
						label="Ngày"
						rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
					>
						<DatePicker style={{ width: '100%' }} placeholder="Chọn ngày" />
					</Form.Item>

					<Form.Item
						name="startTime"
						label="Giờ bắt đầu"
						rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu' }]}
					>
						<TimePicker format="HH:mm" style={{ width: '100%' }} placeholder="Chọn giờ bắt đầu" />
					</Form.Item>

					<Form.Item
						name="endTime"
						label="Giờ kết thúc"
						rules={[{ required: true, message: 'Vui lòng chọn giờ kết thúc' }]}
					>
						<TimePicker format="HH:mm" style={{ width: '100%' }} placeholder="Chọn giờ kết thúc" />
					</Form.Item>

					<Form.Item
						name="status"
						label="Trạng thái"
						initialValue="pending"
					>
						<Select>
							<Select.Option value="pending">Chờ xác nhận</Select.Option>
							<Select.Option value="confirmed"><CheckCircleOutlined /> Đã xác nhận</Select.Option>
							<Select.Option value="completed"><CheckCircleOutlined /> Hoàn thành</Select.Option>
							<Select.Option value="cancelled">Đã hủy</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item
						name="notes"
						label="Ghi chú"
					>
						<Input.TextArea rows={3} placeholder="Thêm ghi chú nếu cần" />
					</Form.Item>

					<Form.Item>
					<Button type="primary" htmlType="submit" block size="large" icon={isEditBooking ? <SaveOutlined /> : <PlusOutlined />}>
						{isEditBooking ? 'Cập nhật' : 'Đặt lịch'}
						</Button>
					</Form.Item>
				</Form>
			</Drawer>
		</div>
	);
};

export default BookingManagement;
