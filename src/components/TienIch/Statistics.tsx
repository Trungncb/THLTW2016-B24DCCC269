import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Select, Button, Statistic, Table, DatePicker, Empty } from 'antd';
import { useBooking, useRating, useService } from '@/models/tienich';
import dayjs from 'dayjs';
import { CalendarOutlined, UserOutlined, ShoppingOutlined, StarOutlined, DollarOutlined, BarChartOutlined, FileTextOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const Statistics: React.FC = () => {
	const { bookingList } = useBooking();
	const { ratingList } = useRating();
	const { serviceList } = useService();
	const [startDate, setStartDate] = useState(dayjs().startOf('month'));
	const [endDate, setEndDate] = useState(dayjs());
	const [selectedService, setSelectedService] = useState<number | undefined>();

	// Tính toán thống kê
	const filteredBookings = bookingList.filter(b => {
		const bookingDate = dayjs(b.date);
		return bookingDate.isBetween(startDate, endDate, null, '[]');
	});

	const completedBookings = filteredBookings.filter(b => b.status === 'completed');
	const totalRevenue = completedBookings.reduce((sum, booking) => {
		const service = serviceList.find(s => s.id === booking.serviceId);
		return sum + (service?.price || 0);
	}, 0);

	const averageRating = ratingList.length > 0 
		? (ratingList.reduce((sum, r) => sum + r.score, 0) / ratingList.length).toFixed(1)
		: 0;

	return (
		<div>
			<div style={{ marginBottom: '20px' }}>
				<h2 style={{ color: '#1890ff', marginBottom: '15px' }}><BarChartOutlined /> Thống kê &amp; Báo cáo</h2>
				<p style={{ color: '#666', marginBottom: '15px' }}>Thống kê từ {startDate.format('DD/MM/YYYY')} đến {endDate.format('DD/MM/YYYY')}</p>
			</div>

			<div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
				<Row gutter={16}>
					<Col span={12}>
						<DatePicker 
							value={startDate} 
							onChange={(date) => setStartDate(date!)}
							placeholder="Ngày bắt đầu"
							style={{ width: '100%' }}
						/>
					</Col>
					<Col span={12}>
						<DatePicker 
							value={endDate} 
							onChange={(date) => setEndDate(date!)}
							placeholder="Ngày kết thúc"
							style={{ width: '100%' }}
						/>
					</Col>
				</Row>
			</div>

			<Row gutter={16} style={{ marginBottom: '20px' }}>
				<Col xs={24} sm={12} lg={6}>
					<Card 
						hoverable
						style={{ 
							borderRadius: '8px',
							boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
							borderTop: '3px solid #1890ff',
							background: 'linear-gradient(135deg, #fff 0%, #f0f7ff 100%)'
						}}
					>
						<div style={{ textAlign: 'center' }}>
							<CalendarOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '10px' }} />
							<Statistic
								title="Tổng lịch hẹn"
								value={filteredBookings.length}
								valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}
							/>
						</div>
					</Card>
				</Col>

				<Col xs={24} sm={12} lg={6}>
					<Card 
						hoverable
						style={{ 
							borderRadius: '8px',
							boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
							borderTop: '3px solid #52c41a',
							background: 'linear-gradient(135deg, #fff 0%, #f6ffed 100%)'
						}}
					>
						<div style={{ textAlign: 'center' }}>
							<ShoppingOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '10px' }} />
							<Statistic
								title="Lịch hoàn thành"
								value={completedBookings.length}
								valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }}
							/>
						</div>
					</Card>
				</Col>

				<Col xs={24} sm={12} lg={6}>
					<Card 
						hoverable
						style={{ 
							borderRadius: '8px',
							boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
							borderTop: '3px solid #faad14',
							background: 'linear-gradient(135deg, #fff 0%, #fffbe6 100%)'
						}}
					>
						<div style={{ textAlign: 'center' }}>
							<DollarOutlined style={{ fontSize: '32px', color: '#faad14', marginBottom: '10px' }} />
							<Statistic
								title="Tổng doanh thu"
								value={totalRevenue}
								suffix="₫"
								valueStyle={{ color: '#faad14', fontSize: '24px', fontWeight: 'bold' }}
								formatter={(value) => `${(value as number).toLocaleString('vi-VN')}`}
							/>
						</div>
					</Card>
				</Col>

				<Col xs={24} sm={12} lg={6}>
					<Card 
						hoverable
						style={{ 
							borderRadius: '8px',
							boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
							borderTop: '3px solid #f5222d',
							background: 'linear-gradient(135deg, #fff 0%, #fff1f0 100%)'
						}}
					>
						<div style={{ textAlign: 'center' }}>
							<StarOutlined style={{ fontSize: '32px', color: '#f5222d', marginBottom: '10px' }} />
							<Statistic
								title="Đánh giá trung bình"
								value={averageRating}
								suffix="/5"
								valueStyle={{ color: '#f5222d', fontSize: '24px', fontWeight: 'bold' }}
								precision={1}
							/>
						</div>
					</Card>
				</Col>
			</Row>

			<Row gutter={16}>
				<Col xs={24} lg={12}>
					<Card 
						title={<span><FileTextOutlined /> Thông tin khác</span>}
						style={{ 
							borderRadius: '8px',
							boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
						}}
					>
						<p style={{ marginBottom: '10px' }}>
							<strong><UserOutlined /> Tổng nhân viên:</strong> {localStorage.getItem('staff') ? JSON.parse(localStorage.getItem('staff')).length : 0}
						</p>
						<p style={{ marginBottom: '10px' }}>
							<strong><ShoppingOutlined /> Tổng dịch vụ:</strong> {serviceList.length}
						</p>
						<p style={{ marginBottom: '10px' }}>
							<strong><FileTextOutlined /> Tổng đánh giá:</strong> {ratingList.length}
						</p>
						<p>
							<strong><ClockCircleOutlined /> Lịch chờ xác nhận:</strong> {filteredBookings.filter(b => b.status === 'pending').length}
						</p>
					</Card>
				</Col>

				<Col xs={24} lg={12}>
					<Card 
						title={<span><BarChartOutlined /> Tóm tắt</span>}
						style={{ 
							borderRadius: '8px',
							boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
						}}
					>
						<p style={{ marginBottom: '10px' }}>
							<strong>✅ Tỷ lệ hoàn thành:</strong> {filteredBookings.length > 0 ? ((completedBookings.length / filteredBookings.length) * 100).toFixed(0) : 0}%
						</p>
						<p style={{ marginBottom: '10px' }}>
							<strong>💰 Doanh thu trung bình/lịch:</strong> {completedBookings.length > 0 ? (totalRevenue / completedBookings.length).toLocaleString('vi-VN') : 0}₫
						</p>
						<p style={{ marginBottom: '10px' }}>
							<strong>⭐ Tỷ lệ đánh giá ≥4 sao:</strong> {ratingList.length > 0 ? ((ratingList.filter(r => r.score >= 4).length / ratingList.length) * 100).toFixed(0) : 0}%
						</p>
						<p>
							<strong>📊 Trạng thái:</strong> <span style={{ color: '#52c41a', fontWeight: 'bold' }}>Hoạt động bình thường</span>
						</p>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default Statistics;
