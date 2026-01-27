import React, { useMemo } from 'react';
import { Card, Row, Col, Statistic, Progress, Badge, Table, Space } from 'antd';
import { ShoppingCartOutlined, DollarOutlined, ShoppingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import { useProduct } from '@/models/product';
import { useOrder, Order } from '@/models/order';

export const Dashboard: React.FC = () => {
  const { products } = useProduct();
  const { orders, getOrderStats } = useOrder();

  const stats = useMemo(() => getOrderStats(), [getOrderStats]);

  const totalInventoryValue = useMemo(() => {
    return products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  }, [products]);

  const recentOrders = useMemo(() => {
    return orders.sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix()).slice(0, 5);
  }, [orders]);

  const recentOrdersColumns: ColumnsType<Order> = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
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
      render: (status) => {
        const statusColors = {
          'Chờ xử lý': 'processing',
          'Đang giao': 'processing',
          'Hoàn thành': 'success',
          'Đã hủy': 'error',
        } as const;
        return <Badge status={statusColors[status as keyof typeof statusColors]} text={status} />;
      },
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      {/* Key Statistics */}
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng số sản phẩm"
              value={products.length}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Giá trị tồn kho"
              value={totalInventoryValue}
              suffix="đ"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
              formatter={(value) => (value as number).toLocaleString('vi-VN')}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng số đơn hàng"
              value={stats.total}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Doanh thu (Hoàn thành)"
              value={stats.revenue}
              suffix="đ"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#f5222d' }}
              formatter={(value) => (value as number).toLocaleString('vi-VN')}
            />
          </Card>
        </Col>
      </Row>

      {/* Order Status Breakdown */}
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col xs={24} md={12}>
          <Card title="Trạng thái đơn hàng">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <div style={{ marginBottom: '8px' }}>
                  <span>Chờ xử lý: {stats.pending}</span>
                  <span style={{ float: 'right' }}>
                    {stats.total > 0 ? ((stats.pending / stats.total) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <Progress percent={stats.total > 0 ? (stats.pending / stats.total) * 100 : 0} />
              </div>

              <div>
                <div style={{ marginBottom: '8px' }}>
                  <span>Đang giao: {stats.shipping}</span>
                  <span style={{ float: 'right' }}>
                    {stats.total > 0 ? ((stats.shipping / stats.total) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <Progress percent={stats.total > 0 ? (stats.shipping / stats.total) * 100 : 0} status="active" />
              </div>

              <div>
                <div style={{ marginBottom: '8px' }}>
                  <span>Hoàn thành: {stats.completed}</span>
                  <span style={{ float: 'right' }}>
                    {stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <Progress percent={stats.total > 0 ? (stats.completed / stats.total) * 100 : 0} status="success" />
              </div>

              <div>
                <div style={{ marginBottom: '8px' }}>
                  <span>Đã hủy: {stats.cancelled}</span>
                  <span style={{ float: 'right' }}>
                    {stats.total > 0 ? ((stats.cancelled / stats.total) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <Progress percent={stats.total > 0 ? (stats.cancelled / stats.total) * 100 : 0} status="exception" />
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Tình trạng tồn kho">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <div style={{ marginBottom: '8px' }}>
                  <span>Còn hàng (&gt; 10): {products.filter((p) => p.quantity > 10).length}</span>
                </div>
                <Progress
                  percent={products.length > 0 ? (products.filter((p) => p.quantity > 10).length / products.length) * 100 : 0}
                  status="success"
                />
              </div>

              <div>
                <div style={{ marginBottom: '8px' }}>
                  <span>Sắp hết (1-10): {products.filter((p) => p.quantity > 0 && p.quantity <= 10).length}</span>
                </div>
                <Progress
                  percent={
                    products.length > 0
                      ? (products.filter((p) => p.quantity > 0 && p.quantity <= 10).length / products.length) * 100
                      : 0
                  }
                  status="active"
                />
              </div>

              <div>
                <div style={{ marginBottom: '8px' }}>
                  <span>Hết hàng (0): {products.filter((p) => p.quantity === 0).length}</span>
                </div>
                <Progress
                  percent={products.length > 0 ? (products.filter((p) => p.quantity === 0).length / products.length) * 100 : 0}
                  status="exception"
                />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Recent Orders */}
      <Card title="Đơn hàng gần đây">
        <Table
          columns={recentOrdersColumns}
          dataSource={recentOrders}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );
};
