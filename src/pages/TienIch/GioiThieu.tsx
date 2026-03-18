import React from 'react';
import { Card, Timeline, Divider, Row, Col, Statistic, Tag, Button, Space } from 'antd';
import { GithubOutlined, LinkedinOutlined } from '@ant-design/icons';

const GioiThieu: React.FC = () => {
	return (
		<div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
			<Card title="📱 About This Application" extra={<Tag color="blue">v5.0.0</Tag>}>
				<h2>Giới Thiệu</h2>
				<p>
					Đây là một ứng dụng Ant Design Pro với các chức năng quản lý hệ thống. 
					Ứng dụng được xây dựng bằng React + TypeScript + UmiJS và sử dụng Ant Design UI library.
				</p>

				<Divider />

				<h3>🎯 Tính Năng Chính</h3>
				<Timeline
					items={[
						{
							children: (
								<div>
									<p><strong>Dashboard</strong> - Trang chủ với các widget thông tin</p>
								</div>
							),
						},
						{
							children: (
								<div>
									<p><strong>Random User</strong> - Hiển thị danh sách người dùng ngẫu nhiên</p>
								</div>
							),
						},
						{
							children: (
								<div>
									<p><strong>Todo List</strong> - Ứng dụng quản lý công việc cá nhân</p>
								</div>
							),
						},
						{
							children: (
								<div>
									<p><strong>Guess Number</strong> - Trò chơi đoán số may mắn</p>
								</div>
							),
						},
						{
							children: (
								<div>
									<p><strong>Tien Ich (TienIch)</strong> - Quản lý dịch vụ (salon, spa, khám bệnh, v.v.)</p>
								</div>
							),
						},
						{
							children: (
								<div>
									<p><strong>Notification</strong> - Hệ thống thông báo OneSignal</p>
								</div>
							),
						},
					]}
				/>

				<Divider />

				<h3>🛠️ Công Nghệ Sử Dụng</h3>
				<Row gutter={16}>
					<Col span={12}>
						<Card size="small">
							<Statistic title="React" value="18+" />
							<p>UI Library chính</p>
						</Card>
					</Col>
					<Col span={12}>
						<Card size="small">
							<Statistic title="TypeScript" value="5+" />
							<p>Ngôn ngữ lập trình</p>
						</Card>
					</Col>
				</Row>
				<Row gutter={16} style={{ marginTop: '16px' }}>
					<Col span={12}>
						<Card size="small">
							<Statistic title="UmiJS" value="4+" />
							<p>Framework</p>
						</Card>
					</Col>
					<Col span={12}>
						<Card size="small">
							<Statistic title="Ant Design" value="5+" />
							<p>UI Framework</p>
						</Card>
					</Col>
				</Row>

				<Divider />

				<h3>📊 Module Quản Lý Dịch Vụ (TienIch)</h3>
				<p>
					Module này cung cấp các tính năng hoàn chỉnh để quản lý dịch vụ:
				</p>
				<ul>
					<li>✅ Quản lý nhân viên & lịch làm việc</li>
					<li>✅ Quản lý danh sách dịch vụ</li>
					<li>✅ Đặt lịch hẹn với kiểm tra xung đột tự động</li>
					<li>✅ Đánh giá dịch vụ & phản hồi từ nhân viên</li>
					<li>✅ Thống kê & báo cáo doanh thu</li>
				</ul>

				<Divider />

				<h3>🚀 Hướng Phát Triển</h3>
				<Space direction="vertical" style={{ width: '100%' }}>
					<p>• Kết nối backend API thực tế</p>
					<p>• Thêm xác thực người dùng (Authentication)</p>
					<p>• Thêm khả năng gửi email/SMS thông báo</p>
					<p>• Thêm tính năng book online cho khách hàng</p>
					<p>• Tích hợp thanh toán trực tuyến</p>
				</Space>

				<Divider />

				<h3>📝 Thông Tin Liên Hệ</h3>
				<Space>
					<Button type="primary" icon={<GithubOutlined />}>
						GitHub
					</Button>
					<Button type="default" icon={<LinkedinOutlined />}>
						LinkedIn
					</Button>
				</Space>
			</Card>
		</div>
	);
};

export default GioiThieu;
