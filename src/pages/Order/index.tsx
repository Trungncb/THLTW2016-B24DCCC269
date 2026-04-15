import React, { useState, useMemo } from 'react';
import { 
  Table, Button, Input, Select, Space, Tag, Modal, 
  Form, Popconfirm, message, Row, Col 
} from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

enum OrderStatus {
  PENDING = 'PENDING',
  DELIVERING = 'DELIVERING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

const StatusConfig = {
  [OrderStatus.PENDING]: { text: 'Chờ xác nhận', color: 'warning' },
  [OrderStatus.DELIVERING]: { text: 'Đang giao', color: 'processing' },
  [OrderStatus.COMPLETED]: { text: 'Hoàn thành', color: 'success' },
  [OrderStatus.CANCELLED]: { text: 'Hủy', color: 'error' },
};

interface Customer {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Order {
  id: string;
  customerId: string;
  date: string;
  productIds: string[];
  total: number;
  status: OrderStatus;
}

const mockCustomers: Customer[] = [
  { id: 'C01', name: 'Nguyễn Văn A' },
  { id: 'C02', name: 'Trần Thị B' },
  { id: 'C03', name: 'Lê Văn C' },
];

const mockProducts: Product[] = [
  { id: 'P01', name: 'Laptop Dell XPS', price: 35000000 },
  { id: 'P02', name: 'Chuột Logitech', price: 500000 },
  { id: 'P03', name: 'Bàn phím cơ', price: 1500000 },
  { id: 'P04', name: 'Màn hình LG 24inch', price: 4000000 },
];

const initialOrders: Order[] = [
  { id: 'ORD-001', customerId: 'C01', date: '2023-10-01', productIds: ['P01', 'P02'], total: 35500000, status: OrderStatus.COMPLETED },
  { id: 'ORD-002', customerId: 'C02', date: '2023-10-05', productIds: ['P03'], total: 1500000, status: OrderStatus.PENDING },
  { id: 'ORD-003', customerId: 'C03', date: '2023-10-10', productIds: ['P04', 'P02'], total: 4500000, status: OrderStatus.DELIVERING },
];

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [form] = Form.useForm();

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const customer = mockCustomers.find(c => c.id === order.customerId);
      const matchSearch =
        order.id.toLowerCase().includes(searchText.toLowerCase()) ||
        (customer && customer.name.toLowerCase().includes(searchText.toLowerCase()));
      const matchStatus = statusFilter ? order.status === statusFilter : true;
      return matchSearch && matchStatus;
    });
  }, [orders, searchText, statusFilter]);

  const handleOpenModal = (order?: Order) => {
    if (order) {
      setEditingOrder(order);
      form.setFieldsValue(order);
    } else {
      setEditingOrder(null);
      form.resetFields();
      form.setFieldsValue({
        date: new Date().toISOString().split('T')[0],
        status: OrderStatus.PENDING,
        total: 0,
      });
    }
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingOrder) {
        setOrders(orders.map(o => o.id === editingOrder.id ? { ...o, ...values } : o));
        message.success('Cập nhật đơn hàng thành công!');
      } else {
        setOrders([...orders, values as Order]);
        message.success('Thêm đơn hàng thành công!');
      }
      setIsModalVisible(false);
      setEditingOrder(null);
      form.resetFields();
    } catch (error) {}
  };

  const handleValuesChange = (changedValues: any, allValues: any) => {
    if (changedValues.productIds) {
      const selectedProducts = allValues.productIds || [];
      const newTotal = selectedProducts.reduce((sum: number, productId: string) => {
        const product = mockProducts.find(p => p.id === productId);
        return sum + (product?.price || 0);
      }, 0);
      form.setFieldsValue({ total: newTotal });
    }
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: OrderStatus.CANCELLED } : o));
    message.success('Đã hủy đơn hàng!');
  };

  const columns: ColumnsType<Order> = [
    { title: 'Mã đơn hàng', dataIndex: 'id' },
    {
      title: 'Khách hàng',
      dataIndex: 'customerId',
      render: (id: string) => mockCustomers.find(c => c.id === id)?.name || 'N/A',
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'date',
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      render: (val: number) => `${val.toLocaleString()} VNĐ`,
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: OrderStatus) => (
        <Tag color={StatusConfig[status].color}>
          {StatusConfig[status].text}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleOpenModal(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn hủy đơn hàng này?"
            onConfirm={() => handleCancelOrder(record.id)}
            disabled={record.status !== OrderStatus.PENDING}
          >
            <Button danger icon={<DeleteOutlined />} disabled={record.status !== OrderStatus.PENDING}>
              Hủy
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '100vh' }}>
      <h2>Quản Lý Đơn Hàng</h2>

      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <Input
              placeholder="Tìm kiếm..."
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
            <Select
              placeholder="Trạng thái"
              style={{ width: 150 }}
              allowClear
              onChange={(value) => setStatusFilter(value)}
            >
              {Object.entries(StatusConfig).map(([key, config]) => (
                <Select.Option key={key} value={key}>{config.text}</Select.Option>
              ))}
            </Select>
          </Space>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
            Thêm đơn hàng
          </Button>
        </Col>
      </Row>

      <Table columns={columns} dataSource={filteredOrders} rowKey="id" bordered />

      <Modal
        title={editingOrder ? 'Sửa đơn' : 'Thêm đơn'}
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingOrder(null);
          form.resetFields();
        }}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
          <Form.Item name="id" label="Mã đơn" rules={[{ required: true }]}>
            <Input disabled={!!editingOrder} />
          </Form.Item>

          <Form.Item name="customerId" label="Khách hàng" rules={[{ required: true }]}>
            <Select>
              {mockCustomers.map(c => (
                <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="date" label="Ngày" rules={[{ required: true }]}>
            <Input type="date" />
          </Form.Item>

          <Form.Item name="productIds" label="Sản phẩm" rules={[{ required: true }]}>
            <Select mode="multiple">
              {mockProducts.map(p => (
                <Select.Option key={p.id} value={p.id}>
                  {p.name} - {p.price.toLocaleString()} VNĐ
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="total" label="Tổng tiền">
            <Input readOnly />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
            <Select>
              {Object.entries(StatusConfig).map(([key, config]) => (
                <Select.Option key={key} value={key}>{config.text}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderManagement;