import React, { useEffect } from 'react';
import { Table, Button, Form, Input, InputNumber, Space, Popconfirm, message, Drawer } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useService } from '@/models/tienich';

const ServiceManagement: React.FC = () => {
	const { serviceList, getDataService, addService, updateService, deleteService, serviceItem, setServiceItem, serviceVisible, setServiceVisible, isEditService, setIsEditService } = useService();
	const [form] = Form.useForm();

	useEffect(() => {
		getDataService();
	}, []);

	// Trigger form reset when drawer opens/closes
	useEffect(() => {
		if (!serviceVisible) {
			form.resetFields();
			setServiceItem(undefined);
			setIsEditService(false);
		}
	}, [serviceVisible]);

	const handleAdd = () => {
		setServiceItem(undefined);
		setIsEditService(false);
		form.resetFields();
		setServiceVisible(true);
	};

	const handleEdit = (record: TienIch.Service) => {
		setServiceItem(record);
		setIsEditService(true);
		form.setFieldsValue(record);
		setServiceVisible(true);
	};

	const handleDelete = (id: number | undefined) => {
		if (id) {
			deleteService(id);
			message.success('Xóa dịch vụ thành công');
			getDataService(); // Refresh data after deletion
		}
	};

	const handleCloseDrawer = () => {
		form.resetFields();
		setServiceItem(undefined);
		setIsEditService(false);
		setServiceVisible(false);
	};

	const handleSubmit = async (values: TienIch.Service) => {
		try {
			if (isEditService && serviceItem?.id) {
				updateService({ ...values, id: serviceItem.id });
				message.success('Cập nhật dịch vụ thành công');
			} else {
				addService(values);
				message.success('Thêm dịch vụ thành công');
			}
			await getDataService(); // Refresh data after add/update
			handleCloseDrawer();
		} catch (error) {
			message.error('Có lỗi xảy ra');
		}
	};

	const columns = [
		{
			title: 'Tên dịch vụ',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
			key: 'description',
		},
		{
			title: 'Giá (VND)',
			dataIndex: 'price',
			key: 'price',
			render: (price: number | undefined) => price ? price.toLocaleString('vi-VN') : '0',
		},
		{
			title: 'Thời lượng (phút)',
			dataIndex: 'duration',
			key: 'duration',
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: TienIch.Service) => (
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
					<h2 style={{ margin: '0 0 5px 0', color: '#1890ff' }}>Danh sách Dịch vụ</h2>
					<p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Quản lý các dịch vụ của bạn</p>
				</div>
				<Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleAdd}>
					+ Thêm dịch vụ
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
					dataSource={serviceList}
					rowKey="id"
					pagination={{ pageSize: 10 }}
					bordered
					style={{ borderRadius: '4px' }}
				/>
			</div>

			<Drawer
				title={isEditService ? '✏️ Sửa dịch vụ' : '➕ Thêm dịch vụ'}
				placement="right"
				onClose={handleCloseDrawer}
				visible={serviceVisible}
				width={400}
			>
				<Form
					form={form}
					onFinish={handleSubmit}
					layout="vertical"
					initialValues={{ price: 0, duration: 0 }}
				>
					<Form.Item
						name="name"
						label="Tên dịch vụ"
						rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ' }]}
					>
						<Input placeholder="Nhập tên dịch vụ" />
					</Form.Item>

					<Form.Item
						name="description"
						label="Mô tả"
					>
						<Input.TextArea rows={3} placeholder="Nhập mô tả dịch vụ" />
					</Form.Item>

					<Form.Item
						name="price"
						label="Giá (VND)"
						rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
					>
						<InputNumber style={{ width: '100%' }} min={0} placeholder="Nhập giá" />
					</Form.Item>

					<Form.Item
						name="duration"
						label="Thời lượng (phút)"
					>
						<InputNumber style={{ width: '100%' }} min={0} max={500} placeholder="Nhập thời lượng" />
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit" block size="large" icon={isEditService ? <SaveOutlined /> : <PlusOutlined />}>
							{isEditService ? 'Cập nhật' : 'Thêm'}
						</Button>
					</Form.Item>
				</Form>
			</Drawer>
		</div>
	);
};

export default ServiceManagement;
