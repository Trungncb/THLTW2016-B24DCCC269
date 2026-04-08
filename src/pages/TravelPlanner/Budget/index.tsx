import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  Table,
  Modal,
  message,
  Progress,
  Space,
  Statistic,
  Alert,
  Empty,
} from 'antd';
import { PlusOutlined, DeleteOutlined, DollarOutlined, AlertOutlined } from '@ant-design/icons';
import Chart from 'react-apexcharts';
import { useMediaQuery } from 'react-responsive';
import { BudgetItem, BudgetCategory, Itinerary } from '@/models/travelplanner';
import { budgetService, itineraryService } from '@/services/TravelPlanner';
import styles from './Budget.less';

const Budget: React.FC = () => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [selectedItinerary, setSelectedItinerary] = useState<string>('');
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    loadItineraries();
  }, []);

  useEffect(() => {
    if (selectedItinerary) {
      loadBudgetItems();
    }
  }, [selectedItinerary]);

  const loadItineraries = async () => {
    try {
      const data = await itineraryService.getItineraries();
      setItineraries(data);
      if (data.length > 0) {
        setSelectedItinerary(data[0].id);
      }
    } catch (error) {
      message.error('Không thể tải danh sách lịch trình');
    }
  };

  const loadBudgetItems = async () => {
    try {
      setLoading(true);
      // Mock data for demo
      setBudgetItems([
        {
          id: '1',
          itineraryId: selectedItinerary,
          category: 'accommodation',
          description: 'Khách sạn 3 sao',
          amount: 3000000,
          currency: 'VND',
          date: new Date().toISOString(),
        },
        {
          id: '2',
          itineraryId: selectedItinerary,
          category: 'food',
          description: 'Ăn uống',
          amount: 1000000,
          currency: 'VND',
          date: new Date().toISOString(),
        },
        {
          id: '3',
          itineraryId: selectedItinerary,
          category: 'travel',
          description: 'Vé máy bay',
          amount: 2000000,
          currency: 'VND',
          date: new Date().toISOString(),
        },
        {
          id: '4',
          itineraryId: selectedItinerary,
          category: 'activities',
          description: 'Vé tham quan',
          amount: 500000,
          currency: 'VND',
          date: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      message.error('Không thể tải chi tiêu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBudgetItem = async (values: any) => {
    try {
      const newItem = await budgetService.createBudgetItem({
        itineraryId: selectedItinerary,
        category: values.category,
        description: values.description,
        amount: values.amount,
        currency: 'VND',
        date: new Date().toISOString(),
      });
      setBudgetItems([...budgetItems, newItem]);
      message.success('Thêm chi tiêu thành công');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Lỗi khi thêm chi tiêu');
    }
  };

  const handleDeleteBudgetItem = (id: string) => {
    Modal.confirm({
      title: 'Xóa chi tiêu',
      content: 'Bạn có chắc muốn xóa chi tiêu này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await budgetService.deleteBudgetItem(id);
          setBudgetItems(budgetItems.filter((item) => item.id !== id));
          message.success('Xóa thành công');
        } catch (error) {
          message.error('Lỗi khi xóa');
        }
      },
    });
  };

  const calculateTotals = () => {
    const byCategory: Record<BudgetCategory, number> = {
      accommodation: 0,
      food: 0,
      travel: 0,
      activities: 0,
      other: 0,
    };

    let total = 0;
    budgetItems.forEach((item) => {
      byCategory[item.category] += item.amount;
      total += item.amount;
    });

    return { byCategory, total };
  };

  const { byCategory, total } = calculateTotals();
  const selectedItineraryData = itineraries.find((i) => i.id === selectedItinerary);
  const budget = selectedItineraryData?.budget || 10000000;
  const remaining = budget - total;
  const percentage = Math.round((total / budget) * 100);

  const categoryLabels: Record<BudgetCategory, string> = {
    accommodation: 'Lưu trú',
    food: 'Ăn uống',
    travel: 'Đi lại',
    activities: 'Hoạt động',
    other: 'Khác',
  };

  const chartOptions: any = {
    chart: { type: 'donut' },
    labels: Object.entries(byCategory)
      .filter(([_, v]) => v > 0)
      .map(([k]) => categoryLabels[k as BudgetCategory]),
    colors: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'],
  };

  const chartSeries = Object.values(byCategory).filter((v) => v > 0);

  const columns = [
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => categoryLabels[category as BudgetCategory],
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `${amount.toLocaleString()} VND`,
      responsive: ['md'],
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: BudgetItem) => (
        <Button
          type="text"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteBudgetItem(record.id)}
        />
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Card
        title="Quản lý ngân sách"
        extra={
          <Select
            style={{ width: isMobile ? '100%' : 200 }}
            placeholder="Chọn lịch trình"
            value={selectedItinerary}
            onChange={setSelectedItinerary}
            options={itineraries.map((i) => ({
              label: i.title,
              value: i.id,
            }))}
          />
        }
      >
        {selectedItinerary && itineraries.length > 0 ? (
          <>
            {remaining < budget * 0.1 && (
              <Alert
                message="Cảnh báo ngân sách"
                description={`Bạn sắp hết ngân sách. Còn lại: ${remaining.toLocaleString()} VND`}
                type="warning"
                icon={<AlertOutlined />}
                showIcon
                closable
                style={{ marginBottom: 16 }}
              />
            )}

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="Ngân sách"
                  value={budget}
                  prefix="₫"
                  precision={0}
                  valueStyle={{ fontSize: 16 }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="Đã chi tiêu"
                  value={total}
                  prefix="₫"
                  precision={0}
                  valueStyle={{ fontSize: 16, color: '#f5222d' }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="Còn lại"
                  value={remaining}
                  prefix="₫"
                  precision={0}
                  valueStyle={{ fontSize: 16, color: remaining > 0 ? '#52c41a' : '#f5222d' }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="Tỉ lệ chi tiêu"
                  value={percentage}
                  suffix="%"
                  valueStyle={{ fontSize: 16 }}
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} md={12}>
                <Card title="Tiến độ chi tiêu">
                  <Progress
                    type="circle"
                    percent={Math.min(percentage, 100)}
                    width={150}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': percentage > 100 ? '#f5222d' : '#52c41a',
                    }}
                  />
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="Chi tiêu theo danh mục">
                  {chartSeries.length > 0 ? (
                    <Chart
                      options={chartOptions}
                      series={chartSeries}
                      type="donut"
                      height={300}
                    />
                  ) : (
                    <p style={{ textAlign: 'center', color: '#999' }}>Chưa có chi tiêu nào</p>
                  )}
                </Card>
              </Col>
            </Row>

            <Card
              title="Chi tiết chi tiêu"
              extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                  Thêm
                </Button>
              }
            >
              <Table
                columns={columns}
                dataSource={budgetItems}
                rowKey="id"
                loading={loading}
                scroll={{ x: 500 }}
                pagination={{ pageSize: 10 }}
              />
            </Card>

            <Modal
              title="Thêm chi tiêu"
              open={isModalVisible}
              onOk={() => form.submit()}
              onCancel={() => setIsModalVisible(false)}
              width={isMobile ? '95%' : 600}
            >
              <Form form={form} layout="vertical" onFinish={handleAddBudgetItem}>
                <Form.Item
                  name="category"
                  label="Danh mục"
                  rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                >
                  <Select
                    placeholder="Chọn danh mục"
                    options={[
                      { label: 'Lưu trú', value: 'accommodation' },
                      { label: 'Ăn uống', value: 'food' },
                      { label: 'Đi lại', value: 'travel' },
                      { label: 'Hoạt động', value: 'activities' },
                      { label: 'Khác', value: 'other' },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  name="description"
                  label="Mô tả"
                  rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                >
                  <Input placeholder="Ví dụ: Khách sạn 3 sao" />
                </Form.Item>

                <Form.Item
                  name="amount"
                  label="Số tiền (VND)"
                  rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}
                >
                  <Input type="number" placeholder="Nhập số tiền" />
                </Form.Item>
              </Form>
            </Modal>
          </>
        ) : (
          <Empty description="Vui lòng tạo lịch trình trước" />
        )}
      </Card>
    </div>
  );
};

export default Budget;
