import React, { useEffect } from 'react';
import { Table, Button, Form, Input, Space, Popconfirm, message, Drawer } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { useStaff } from '@/models/tienich';

const StaffManagement: React.FC = () => {
	const { staffList, getDataStaff, addStaff, updateStaff, deleteStaff, staffItem, setStaffItem, staffVisible, setStaffVisible, isEditStaff, setIsEditStaff } = useStaff();
	const [form] = Form.useForm();

	useEffect(() => {
		getDataStaff();
	}, []);

	// Trigger form reset when drawer opens/closes
	useEffect(() => {
		if (!staffVisible) {
			form.resetFields();
			setStaffItem(undefined);
			setIsEditStaff(false);
		}
	}, [staffVisible]);

	const handleAdd = () => {
		setStaffItem(undefined);
		setIsEditStaff(false);
		form.resetFields();
		setStaffVisible(true);
	};

	const handleEdit = (record: TienIch.Staff) => {
		setStaffItem(record);
		setIsEditStaff(true);
		form.setFieldsValue(record);
		setStaffVisible(true);
	};

	const handleDelete = (id: number | undefined) => {
		if (id) {
			deleteStaff(id);
			message.success('Xóa nhân viên thành công');
			getDataStaff(); // Refresh data
		}
	};

	const handleCloseDrawer = () => {
		form.resetFields();
		setStaffItem(undefined);
		setIsEditStaff(false);
		setStaffVisible(false);
	};

	const handleSubmit = async (values: TienIch.Staff) => {
		if (isEditStaff && staffItem?.id) {
			updateStaff({ ...values, id: staffItem.id });
			message.success('Cập nhật nhân viên thành công');
		} else {
			addStaff(values);
			message.success('Thêm nhân viên thành công');
		}
		getDataStaff(); // Refresh data
		handleCloseDrawer();
	};

	const columns = [
		{
			title: 'Họ tên',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Chức vụ',
			dataIndex: 'position',
			key: 'position',
		},
		{
			title: 'Điện thoại',
			dataIndex: 'phone',
			key: 'phone',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: 'Giờ làm việc',
			dataIndex: 'workingHours',
			key: 'workingHours',
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: TienIch.Staff) => (
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
					<h2 style={{ margin: '0 0 5px 0', color: '#1890ff' }}>Danh sách nhân viên</h2>
					<p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Quản lý nhân viên của bạn</p>
				</div>
				<Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleAdd}>
					+ Thêm nhân viên
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
					dataSource={staffList}
					rowKey="id"
					pagination={{ pageSize: 10 }}
					bordered
					style={{ borderRadius: '4px' }}
				/>
			</div>

			<Drawer
				title={isEditStaff ? '✏️ Sửa nhân viên' : '➕ Thêm nhân viên'}
				placement="right"
				onClose={handleCloseDrawer}
				visible={staffVisible}
				width={400}
			>
				<Form
					form={form}
					onFinish={handleSubmit}
					layout="vertical"
				>
					<Form.Item
						name="name"
						label="Tên nhân viên"
						rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên' }]}
					>
						<Input placeholder="Nhập tên nhân viên" />
					</Form.Item>

					<Form.Item
						name="position"
						label="Chức vụ"
					>
						<Input placeholder="Nhập chức vụ" />
					</Form.Item>

					<Form.Item
						name="phone"
						label="Số điện thoại"
						rules={[{ pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }]}
					>
						<Input placeholder="Nhập số điện thoại" />
					</Form.Item>

					<Form.Item
						name="email"
						label="Email"
						rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
					>
						<Input type="email" placeholder="Nhập email" />
					</Form.Item>

					<Form.Item
						name="workingHours"
						label="Giờ làm việc"
					>
						<Input placeholder="Nhập giờ làm việc (vd: 9-17)" />
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit" block size="large" icon={isEditStaff ? <SaveOutlined /> : <PlusOutlined />}>
							{isEditStaff ? 'Cập nhật' : 'Thêm'}
						</Button>
					</Form.Item>
				</Form>
			</Drawer>
		</div>
	);
};

export default StaffManagement;
