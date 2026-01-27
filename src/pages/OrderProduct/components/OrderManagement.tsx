import React, { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Card,
  Row,
  Col,
  DatePicker,
  Drawer,
  Divider,
  Tag,
} from 'antd';
import { DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import { Order, OrderProduct, useOrder } from '@/models/order';
import { useProduct } from '@/models/product';

const PAGE_SIZE = 5;

export const OrderManagement: React.FC = () => {
  const {
    orders,
    addOrder,
    updateOrderStatus,
    deleteOrder,
    getOrderStats,
  } = useOrder();
  const { products, updateProduct } = useProduct();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [form] = Form.useForm();

  // Search and Filter states
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Order['status'] | undefined>();
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [sortBy, setSortBy] = useState<'date-new' | 'date-old' | 'amount'>('date-new');
  const [currentPage, setCurrentPage] = useState(1);

  const stats = useMemo(() => getOrderStats(), [getOrderStats]);

  // Filtered and sorted data
  const filteredAndSortedData = useMemo(() => {
    let filtered = orders.filter((o) => {
      const matchSearch =
        o.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
        o.id.toLowerCase().includes(searchText.toLowerCase());

      const matchStatus = !selectedStatus || o.status === selectedStatus;

      let matchDate = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const orderDate = dayjs(o.createdAt);
        matchDate = orderDate.isAfter(dateRange[0]) && orderDate.isBefore(dateRange[1]);
      }

      return matchSearch && matchStatus && matchDate;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-new':
          return dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix();
        case 'date-old':
          return dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix();
        case 'amount':
          return b.totalAmount - a.totalAmount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [orders, searchText, selectedStatus, dateRange, sortBy]);

  const columns: ColumnsType<Order> = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Số sản phẩm',
      dataIndex: 'products',
      key: 'productCount',
      render: (products: OrderProduct[]) => <span>{products.length}</span>,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => <span>{amount.toLocaleString('vi-VN')} đ</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: Order['status']) => {
        let color = 'blue';
        if (status === 'Đang giao') color = 'cyan';
        if (status === 'Hoàn thành') color = 'green';
        if (status === 'Đã hủy') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => <span>{dayjs(date).format('DD/MM/YYYY')}</span>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record.id)}
          />
          <Button
            type="default"
            size="small"
            onClick={() => handleEditStatus(record)}
          >
            Cập nhật
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  const handleViewDetail = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsDetailDrawerOpen(true);
  };

  const handleEditStatus = (order: Order) => {
    Modal.confirm({
      title: 'Cập nhật trạng thái đơn hàng',
      content: (
        <Form layout="vertical">
          <Form.Item
            label="Trạng thái"
            name="status"
            initialValue={order.status}
          >
            <Select
              id="status-select"
              options={[
                { label: 'Chờ xử lý', value: 'Chờ xử lý' },
                { label: 'Đang giao', value: 'Đang giao' },
                { label: 'Hoàn thành', value: 'Hoàn thành' },
                { label: 'Đã hủy', value: 'Đã hủy' },
              ]}
              defaultValue={order.status}
            />
          </Form.Item>
        </Form>
      ),
      okText: 'Cập nhật',
      cancelText: 'Hủy',
      onOk: () => {
        const selectEl = document.getElementById('status-select') as any;
        const newStatus = selectEl?.value || order.status;
        
        const oldStatus = order.status;
        const newStatusValue = newStatus as Order['status'];

        // Update order status
        updateOrderStatus(order.id, newStatusValue);

        // Handle inventory when order is completed or cancelled
        if (oldStatus !== 'Hoàn thành' && newStatusValue === 'Hoàn thành') {
          // Reduce inventory when order is completed
          order.products.forEach((op) => {
            const product = products.find((p) => p.id === op.productId);
            if (product) {
              updateProduct(product.id, { quantity: product.quantity - op.quantity });
            }
          });
        } else if (oldStatus !== 'Đã hủy' && newStatusValue === 'Đã hủy') {
          // Return inventory when order is cancelled
          order.products.forEach((op) => {
            const product = products.find((p) => p.id === op.productId);
            if (product) {
              updateProduct(product.id, { quantity: product.quantity + op.quantity });
            }
          });
        }

        message.success('Cập nhật trạng thái thành công');
      },
    });
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xóa đơn hàng',
      content: 'Bạn chắc chắn muốn xóa đơn hàng này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: () => {
        deleteOrder(id);
        message.success('Xóa đơn hàng thành công');
      },
    });
  };

  const handleCreateOrder = async () => {
    try {
      const values = await form.validateFields();

      // Validate quantities
      for (const productId of values.productIds) {
        const product = products.find((p) => p.id === productId);
        const quantity = values.quantities[productId];

        if (quantity > (product?.quantity || 0)) {
          message.error(`Số lượng vượt quá tồn kho cho sản phẩm "${product?.name}"`);
          return;
        }
      }

      // Calculate total
      let totalAmount = 0;
      const orderProducts: OrderProduct[] = [];

      values.productIds.forEach((productId: number) => {
        const product = products.find((p) => p.id === productId);
        const quantity = values.quantities[productId];
        if (product) {
          const amount = product.price * quantity;
          totalAmount += amount;
          orderProducts.push({
            productId: product.id,
            productName: product.name,
            quantity,
            price: product.price,
          });
        }
      });

      const newOrder = addOrder({
        customerName: values.customerName,
        phone: values.phone,
        address: values.address,
        products: orderProducts,
        totalAmount,
        status: 'Chờ xử lý',
        createdAt: dayjs().format('YYYY-MM-DD'),
      });
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  return (
    <div style={{ padding: '20px' }}>
      <Card>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          style={{ marginBottom: '20px' }}
        >
          Tạo đơn hàng
        </Button>

        {/* Stats */}
        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col xs={12} sm={8} md={4}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{stats.total}</div>
                <div>Tổng đơn hàng</div>
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
                  {stats.pending}
                </div>
                <div>Chờ xử lý</div>
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#13c2c2' }}>
                  {stats.shipping}
                </div>
                <div>Đang giao</div>
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a' }}>
                  {stats.completed}
                </div>
                <div>Hoàn thành</div>
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f5222d' }}>
                  {stats.cancelled}
                </div>
                <div>Đã hủy</div>
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#faad14' }}>
                  {stats.revenue.toLocaleString('vi-VN')} đ
                </div>
                <div>Doanh thu</div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Tìm theo mã hoặc tên khách hàng"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Lọc theo trạng thái"
              allowClear
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={[
                { label: 'Chờ xử lý', value: 'Chờ xử lý' },
                { label: 'Đang giao', value: 'Đang giao' },
                { label: 'Hoàn thành', value: 'Hoàn thành' },
                { label: 'Đã hủy', value: 'Đã hủy' },
              ]}
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Select
              value={sortBy}
              onChange={setSortBy}
              options={[
                { label: 'Ngày tạo (mới)', value: 'date-new' },
                { label: 'Ngày tạo (cũ)', value: 'date-old' },
                { label: 'Tổng tiền', value: 'amount' },
              ]}
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              onChange={(dates: any) => {
                setDateRange(dates);
                setCurrentPage(1);
              }}
            />
          </Col>
        </Row>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={paginatedData}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize: PAGE_SIZE,
            total: filteredAndSortedData.length,
            onChange: setCurrentPage,
          }}
        />
      </Card>

      {/* Create Order Modal */}
      <Modal
        title="Tạo đơn hàng mới"
        visible={isModalOpen}
        onOk={handleCreateOrder}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            label="Tên khách hàng"
            name="customerName"
            rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              {
                pattern: /^0\d{9,10}$/,
                message: 'Số điện thoại phải đúng định dạng (10-11 số)',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item
            label="Chọn sản phẩm"
            name="productIds"
            rules={[{ required: true, message: 'Vui lòng chọn sản phẩm' }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn sản phẩm"
              options={products
                .filter((p) => p.quantity > 0)
                .map((p) => ({
                  label: `${p.name} (${p.quantity} cái)`,
                  value: p.id,
                }))}
            />
          </Form.Item>

          {form.getFieldValue('productIds') && form.getFieldValue('productIds').length > 0 && (
            <>
              <Divider />
              <div style={{ marginBottom: '16px' }}>
                <strong>Nhập số lượng cho từng sản phẩm:</strong>
              </div>
              {form.getFieldValue('productIds').map((productId: number) => {
                const product = products.find((p) => p.id === productId);
                return (
                  <Form.Item
                    key={productId}
                    label={`${product?.name}`}
                    name={['quantities', productId]}
                    initialValue={1}
                    rules={[
                      { required: true, message: 'Vui lòng nhập số lượng' },
                      {
                        type: 'number',
                        min: 1,
                        max: product?.quantity || 0,
                        message: `Số lượng phải từ 1 đến ${product?.quantity}`,
                      },
                    ]}
                  >
                    <InputNumber min={1} max={product?.quantity || 0} />
                  </Form.Item>
                );
              })}
            </>
          )}
        </Form>
      </Modal>

      {/* Detail Drawer */}
      <Drawer
        title="Chi tiết đơn hàng"
        placement="right"
        onClose={() => setIsDetailDrawerOpen(false)}
        visible={isDetailDrawerOpen}
        width={500}
      >
        {selectedOrder && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <strong>Mã đơn hàng:</strong> {selectedOrder.id}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Tên khách hàng:</strong> {selectedOrder.customerName}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Số điện thoại:</strong> {selectedOrder.phone}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Địa chỉ:</strong> {selectedOrder.address}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Trạng thái:</strong>{' '}
              <Tag
                color={
                  selectedOrder.status === 'Hoàn thành'
                    ? 'green'
                    : selectedOrder.status === 'Đang giao'
                    ? 'cyan'
                    : selectedOrder.status === 'Đã hủy'
                    ? 'red'
                    : 'blue'
                }
              >
                {selectedOrder.status}
              </Tag>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Ngày tạo:</strong> {dayjs(selectedOrder.createdAt).format('DD/MM/YYYY')}
            </div>

            <Divider />

            <strong>Danh sách sản phẩm:</strong>
            {selectedOrder.products.map((product, index) => (
              <Card key={index} size="small" style={{ marginTop: '8px' }}>
                <div>
                  <strong>{product.productName}</strong>
                </div>
                <div>Số lượng: {product.quantity}</div>
                <div>Giá: {product.price.toLocaleString('vi-VN')} đ</div>
                <div>Tổng: {(product.price * product.quantity).toLocaleString('vi-VN')} đ</div>
              </Card>
            ))}

            <Divider />

            <div style={{ marginTop: '16px', textAlign: 'right' }}>
              <strong>Tổng tiền: </strong>
              <span style={{ fontSize: '18px', color: '#f5222d', fontWeight: 'bold' }}>
                {selectedOrder.totalAmount.toLocaleString('vi-VN')} đ
              </span>
            </div>
          </>
        )}
      </Drawer>
    </div>
  );
};
