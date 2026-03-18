import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { TeamOutlined, ShoppingOutlined, CalendarOutlined, StarOutlined, BarChartOutlined } from '@ant-design/icons';
import { StaffManagement, ServiceManagement, BookingManagement, RatingManagement, Statistics } from '@/components/TienIch';

const TienIchPage: React.FC = () => {
	const [activeKey, setActiveKey] = useState('service');

	useEffect(() => {
		// Debug: Initialize sample data if empty
		if (!localStorage.getItem('service')) {
			const sampleServices = [
				{ id: 1, name: 'Cắt tóc', description: 'Cắt tóc đẹp', price: 50000, duration: 30 },
				{ id: 2, name: 'Gội đầu', description: 'Gội và massage đầu', price: 30000, duration: 15 },
			];
			localStorage.setItem('service', JSON.stringify(sampleServices));
		}
		if (!localStorage.getItem('staff')) {
			const sampleStaff = [
				{ id: 1, name: 'Nguyễn Văn A', position: 'Stylist', phone: '0123456789', email: 'a@example.com', workingHours: '9h-17h' },
			];
			localStorage.setItem('staff', JSON.stringify(sampleStaff));
		}
	}, []);

	return (
		<div style={{ 
			minHeight: '100vh', 
			backgroundColor: '#f0f2f5',
			padding: '30px 20px'
		}}>
			<div style={{ maxWidth: '1400px', margin: '0 auto' }}>
				<div style={{ marginBottom: '30px' }}>
					<h1 style={{ 
						fontSize: '28px', 
						fontWeight: 'bold',
						color: '#1890ff',
						margin: '0 0 10px 0'
					}}>
						Quản Lý Dịch Vụ (Salon, Spa, Khám Bệnh,...)
					</h1>
					<p style={{ color: '#666', margin: '5px 0 0 0' }}>
						Hệ thống quản lý toàn diện cho các dịch vụ của bạn
					</p>
				</div>

				<div style={{ 
					backgroundColor: '#fff', 
					borderRadius: '8px', 
					boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
					overflow: 'hidden'
				}}>
					<Tabs
						activeKey={activeKey}
						onChange={setActiveKey}
						type="card"
						size="large"
						style={{ padding: '0' }}
					>
						<Tabs.TabPane tab={<span><TeamOutlined /> Nhân viên</span>} key="staff">
							<div style={{ padding: '20px' }}>
								<StaffManagement />
							</div>
						</Tabs.TabPane>
						<Tabs.TabPane tab={<span><ShoppingOutlined /> Dịch vụ</span>} key="service">
							<div style={{ padding: '20px' }}>
								<ServiceManagement />
							</div>
						</Tabs.TabPane>
						<Tabs.TabPane tab={<span><CalendarOutlined /> Lịch hẹn</span>} key="booking">
							<div style={{ padding: '20px' }}>
								<BookingManagement />
							</div>
						</Tabs.TabPane>
						<Tabs.TabPane tab={<span><StarOutlined /> Đánh giá</span>} key="rating">
							<div style={{ padding: '20px' }}>
								<RatingManagement />
							</div>
						</Tabs.TabPane>
						<Tabs.TabPane tab={<span><BarChartOutlined /> Thống kê</span>} key="statistics">
							<div style={{ padding: '20px' }}>
								<Statistics />
							</div>
						</Tabs.TabPane>
					</Tabs>
				</div>
			</div>
		</div>
	);
};

export default TienIchPage;
