import React, { useEffect } from 'react';
import { Table, Button, Form, Input, Space, message, Drawer, Select, Rate, Card, Empty, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, SaveOutlined, StarOutlined, TeamOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useRating } from '@/models/tienich';

const RatingManagement: React.FC = () => {
	const { ratingList, getDataRating, addRating, updateRating, ratingItem, setRatingItem, ratingVisible, setRatingVisible, getAverageRating, getStaffRatings } = useRating();
	const [form] = Form.useForm();
	const [bookingList, setBookingList] = React.useState<TienIch.Booking[]>([]);
	const [staffList, setStaffList] = React.useState<TienIch.Staff[]>([]);
	const [serviceList, setServiceList] = React.useState<TienIch.Service[]>([]);

	useEffect(() => {
		getDataRating();
		const bookingData = JSON.parse(localStorage.getItem('booking') as any) || [];
		const staffData = JSON.parse(localStorage.getItem('staff') as any) || [];
		const serviceData = JSON.parse(localStorage.getItem('service') as any) || [];
		setBookingList(bookingData.filter((b: TienIch.Booking) => b.status === 'completed'));
		setStaffList(staffData);
		setServiceList(serviceData);
	}, []);

	const handleAdd = () => {
		setRatingItem(undefined);
		form.resetFields();
		setRatingVisible(true);
	};

	const handleCloseDrawer = () => {
		form.resetFields();
		setRatingItem(undefined);
		setRatingVisible(false);
	};

	const handleSubmit = async (values: TienIch.Rating) => {
		if (ratingItem?.id) {
			updateRating({ ...values, id: ratingItem.id });
			message.success('Cập nhật đánh giá thành công');
		} else {
			addRating(values);
			message.success('Thêm đánh giá thành công');
		}
		getDataRating(); // Refresh data
		handleCloseDrawer();
	};

	const handleReply = (id: number) => {
		const rating = ratingList.find(r => r.id === id);
		if (rating) {
			form.setFieldsValue({ ...rating, staffReply: '' });
			setRatingItem(rating);
			setRatingVisible(true);
		}
	};

	const columns = [
		{
			title: 'Nhân viên',
			dataIndex: 'staffId',
			key: 'staffId',
			render: (staffId: number) => staffList.find(s => s.id === staffId)?.name || 'N/A',
		},
		{
			title: 'Dịch vụ',
			dataIndex: 'serviceId',
			key: 'serviceId',
			render: (serviceId: number) => serviceList.find(s => s.id === serviceId)?.name || 'N/A',
		},
		{
			title: 'Đánh giá',
			dataIndex: 'score',
			key: 'score',
			render: (score: number) => <Rate disabled defaultValue={score} />,
		},
		{
			title: 'Bình luận',
			dataIndex: 'comment',
			key: 'comment',
			width: 200,
			ellipsis: true,
		},
		{
			title: 'Phản hồi nhân viên',
			dataIndex: 'staffReply',
			key: 'staffReply',
			width: 200,
			ellipsis: true,
			render: (reply: string) => reply || '-',
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: TienIch.Rating) => (
				<Space>
					<Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleReply(record.id!)} />
				</Space>
			),
		},
	];

	return (
		<div>
			<div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<div>
					<h2 style={{ margin: '0 0 5px 0', color: '#1890ff' }}>Đánh giá dịch vụ</h2>
					<p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Quản lý các đánh giá từ khách hàng</p>
				</div>
				<Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleAdd}>
					+ Thêm đánh giá
				</Button>
			</div>

			{staffList.length > 0 && (
				<div style={{ marginBottom: '20px' }}>
					<h3 style={{ color: '#1890ff', marginBottom: '15px' }}>📊 Xếp hạng nhân viên</h3>
					<Row gutter={16}>
						{staffList.map(staff => {
							const avgRating = staff.id ? getAverageRating(staff.id) : 0;
							const ratings = staff.id ? getStaffRatings(staff.id) : [];
							return (
								<Col key={staff.id} span={8} style={{ marginBottom: '15px' }}>
									<Card 
										hoverable 
										style={{ 
											borderRadius: '8px',
											boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
											borderLeft: '4px solid #1890ff'
										}}
									>
										<h4 style={{ margin: '0 0 10px 0', color: '#1890ff' }}>{staff.name}</h4>
										<div style={{ marginBottom: '10px' }}>
											<p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
												⭐ Đánh giá: {avgRating > 0 ? `${avgRating.toFixed(1)}/5` : 'Chưa có'}
											</p>
											{avgRating > 0 && <Rate disabled defaultValue={avgRating} style={{ fontSize: '14px' }} />}
										</div>
										<p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
											📝 Số đánh giá: {ratings.length}
										</p>
									</Card>
								</Col>
							);
						})}
					</Row>
				</div>
			)}

			{ratingList.length === 0 ? (
				<Empty 
					description="Chưa có đánh giá nào" 
					style={{
						backgroundColor: '#fff',
						borderRadius: '8px',
						padding: '40px 20px',
						boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
					}}
				/>
			) : (
				<div style={{ 
					backgroundColor: '#fff',
					borderRadius: '8px',
					boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
					overflow: 'hidden',
					padding: '20px'
				}}>
					<Table
						columns={columns}
						dataSource={ratingList}
						rowKey="id"
						pagination={{ pageSize: 10 }}
						bordered
						style={{ borderRadius: '4px' }}
					/>
				</div>
			)}

			<Drawer
			title={ratingItem?.id ? <span><EditOutlined /> Phản hồi đánh giá</span> : <span><PlusOutlined /> Thêm đánh giá</span>}
				placement="right"
				onClose={handleCloseDrawer}
				visible={ratingVisible}
				width={420}
			>
				<Form
					form={form}
					onFinish={handleSubmit}
					layout="vertical"
				>
					<Form.Item
						name="bookingId"
						label="Lịch hẹn đã hoàn thành"
						rules={[{ required: true, message: 'Vui lòng chọn lịch hẹn' }]}
					>
						<Select placeholder="Chọn lịch hẹn">
							{bookingList.map(booking => (
								<Select.Option key={booking.id} value={booking.id}>
									{booking.customerName} - {booking.date} {booking.startTime}
								</Select.Option>
							))}
						</Select>
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
						name="score"
						label="Đánh giá (1-5 sao)"
						rules={[{ required: true, message: 'Vui lòng chọn mức đánh giá' }]}
					>
						<Rate tipFormatter={(value) => `${value} sao`} />
					</Form.Item>

					<Form.Item
						name="comment"
						label="Bình luận"
					>
						<Input.TextArea rows={3} placeholder="Nhận xét của khách hàng" />
					</Form.Item>

					<Form.Item
						name="staffReply"
						label="Phản hồi từ nhân viên"
					>
						<Input.TextArea rows={3} placeholder="Phản hồi từ nhân viên" />
					</Form.Item>

					<Form.Item>
					<Button type="primary" htmlType="submit" block size="large" icon={ratingItem?.id ? <SaveOutlined /> : <PlusOutlined />}>
						{ratingItem?.id ? 'Cập nhật' : 'Thêm đánh giá'}
						</Button>
					</Form.Item>
				</Form>
			</Drawer>
		</div>
	);
};

export default RatingManagement;
