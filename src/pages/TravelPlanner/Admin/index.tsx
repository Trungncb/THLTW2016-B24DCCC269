import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Upload,
  message,
  Space,
  Popconfirm,
  Row,
  Col,
  Statistic,
  Chart,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import ApexChart from 'react-apexcharts';
import { useMediaQuery } from 'react-responsive';
import type { Destination } from '@/models/travelplanner';
import { destinationService } from '@/services/TravelPlanner';
import styles from './Admin.less';

const Admin: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const loadDestinations = async () => {
    try {
      setLoading(true);
      const data = await destinationService.getDestinations();
      setDestinations(data);
    } catch (error) {
      message.error('Không thể tải danh sách điểm đến');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, []);

  const handleAddOredit = async (values: any) => {
    try {
      if (editingDestination) {
        const updated = await destinationService.updateDestination(editingDestination.id, values);
        setDestinations(destinations.map((d) => (d.id === updated.id ? updated : d)));
        message.success('Cập nhật thành công');
      } else {
        const created = await destinationService.createDestination(values);
        setDestinations([...destinations, created]);
        message.success('Tạo thành công');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingDestination(null);
    } catch (error) {
      message.error('Lỗi khi lưu dữ liệu');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await destinationService.deleteDestination(id);
      setDestinations(destinations.filter((d) => d.id !== id));
      message.success('Xóa thành công');
    } catch (error) {
      message.error('Lỗi khi xóa');
    }
  };

  const handleEdit = (destination: Destination) => {
    setEditingDestination(destination);
    form.setFieldsValue(destination);
    setIsModalVisible(true);
  };

  const handleOpenModal = () => {
    setEditingDestination(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'Tên điểm đến',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Destination, b: Destination) => a.name.localeCompare(b.name),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap: Record<string, string> = {
          beach: 'Bãi biển',
          mountain: 'Núi',
          city: 'Thành phố',
        };
        return typeMap[type] || type;
      },
      responsive: ['md'],
    },
    {
      title: 'Địa điểm',
      dataIndex: 'location',
      key: 'location',
      responsive: ['md'],
    },
    {
      title: 'Giá (VND)',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => price.toLocaleString(),
      responsive: ['md'],
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => `⭐ ${rating}`,
      responsive: ['lg'],
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Destination) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Xóa điểm đến"
            description="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="primary" danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const getChartData = () => {
    const typeCount: Record<string, number> = { beach: 0, mountain: 0, city: 0 };
    destinations.forEach((d) => {
      typeCount[d.type]++;
    });

    return {
      labels: ['Bãi biển', 'Núi', 'Thành phố'],
      series: [typeCount.beach, typeCount.mountain, typeCount.city],
    };
  };

  const getLocationStats = () => {
    const locationCount: Record<string, number> = {};
    destinations.forEach((d) => {
      locationCount[d.location] = (locationCount[d.location] || 0) + 1;
    });

    return {
      labels: Object.keys(locationCount),
      series: Object.values(locationCount),
    };
  };

  const chartData = getChartData();
  const locationStats = getLocationStats();
  const avgRating =
    destinations.length > 0
      ? (destinations.reduce((sum, d) => sum + d.rating, 0) / destinations.length).toFixed(1)
      : 0;
  const avgPrice =
    destinations.length > 0
      ? Math.round(destinations.reduce((sum, d) => sum + d.price, 0) / destinations.length)
      : 0;

  return (
    <div className={styles.container}>
      <Card
        title="Quản lý điểm đến"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
            Thêm điểm đến
          </Button>
        }
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={8} md={6}>
            <Statistic title="Tổng điểm đến" value={destinations.length} />
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Statistic title="Đánh giá TB" value={avgRating} precision={1} />
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Statistic
              title="Giá TB"
              value={avgPrice}
              prefix="₫"
              precision={0}
              valueStyle={{ fontSize: 14 }}
            />
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Statistic title="Bãi biển" value={chartData.series[0]} />
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={12}>
            <Card title="Phân bổ theo loại">
              <ApexChart
                options={{
                  chart: { type: 'donut' },
                  labels: chartData.labels,
                  colors: ['#1890ff', '#52c41a', '#faad14'],
                }}
                series={chartData.series}
                type="donut"
                height={300}
              />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Phân bổ theo địa điểm">
              <ApexChart
                options={{
                  chart: { type: 'bar' },
                  xaxis: { categories: locationStats.labels },
                  colors: ['#1890ff'],
                }}
                series={[{ name: 'Số lượng', data: locationStats.series }]}
                type="bar"
                height={300}
              />
            </Card>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={destinations}
          rowKey="id"
          loading={loading}
          scroll={{ x: 500 }}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingDestination ? 'Chỉnh sửa điểm đến' : 'Thêm điểm đến mới'}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
        width={isMobile ? '95%' : 700}
      >
        <Form form={form} layout="vertical" onFinish={handleAddOredit}>
          <Form.Item
            name="name"
            label="Tên điểm đến"
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input placeholder="Ví dụ: Phú Quốc" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input.TextArea placeholder="Mô tả chi tiết về điểm đến" rows={3} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Loại"
                rules={[{ required: true, message: 'Vui lòng chọn loại' }]}
              >
                <Select
                  placeholder="Chọn loại"
                  options={[
                    { label: 'Bãi biển', value: 'beach' },
                    { label: 'Núi', value: 'mountain' },
                    { label: 'Thành phố', value: 'city' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="location"
                label="Địa điểm"
                rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}
              >
                <Input placeholder="Ví dụ: Kiên Giang" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Giá (VND)"
                rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="Nhập giá" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="rating"
                label="Đánh giá (1-5)"
                rules={[{ required: true, message: 'Vui lòng nhập đánh giá' }]}
              >
                <InputNumber min={1} max={5} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="estimatedDays"
                label="Số ngày dự kiến"
                rules={[{ required: true, message: 'Vui lòng nhập số ngày' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="currency"
                label="Tiền tệ"
                initialValue="VND"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { label: 'VND', value: 'VND' },
                    { label: 'USD', value: 'USD' },
                    { label: 'EUR', value: 'EUR' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="image" label="Ảnh đại diện URL">
            <Input placeholder="Nhập URL ảnh" />
          </Form.Item>

          <Form.Item name="bestSeason" label="Mùa tốt nhất">
            <Input placeholder="Ví dụ: November to April" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Admin;
