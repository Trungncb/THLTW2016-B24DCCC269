import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Form,
  Input,
  DatePicker,
  Select,
  Modal,
  message,
  Collapse,
  Tag,
  Row,
  Col,
  Space,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useMediaQuery } from 'react-responsive';
import type { Itinerary, Destination } from '@/models/travelplanner';
import { itineraryService, destinationService } from '@/services/TravelPlanner';
import styles from './Itinerary.less';

const ItineraryComponent: React.FC = () => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const loadData = async () => {
    try {
      const [itinerariesData, destinationsData] = await Promise.all([
        itineraryService.getItineraries(),
        destinationService.getDestinations(),
      ]);
      setItineraries(itinerariesData);
      setDestinations(destinationsData);
    } catch (error) {
      message.error('Không thể tải dữ liệu');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateItinerary = async (values: any) => {
    try {
      const startDate = values.dateRange[0].toISOString();
      const endDate = values.dateRange[1].toISOString();

      const newItinerary: Omit<Itinerary, 'id' | 'createdAt' | 'updatedAt'> = {
        title: values.title,
        description: values.description,
        startDate,
        endDate,
        destinations: [],
        budget: values.budget || 0,
        currency: values.currency || 'VND',
      };

      const result = await itineraryService.createItinerary(newItinerary);
      setItineraries([...itineraries, result]);
      message.success('Tạo lịch trình thành công');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Lỗi khi tạo lịch trình');
    }
  };

  const handleDeleteItinerary = (id: string) => {
    Modal.confirm({
      title: 'Xóa lịch trình',
      content: 'Bạn có chắc muốn xóa lịch trình này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await itineraryService.deleteItinerary(id);
          setItineraries(itineraries.filter((i) => i.id !== id));
          message.success('Xóa thành công');
        } catch (error) {
          message.error('Lỗi khi xóa lịch trình');
        }
      },
    });
  };

  const getDestinationName = (destinationId: string) => {
    return destinations.find((d) => d.id === destinationId)?.name || 'Unknown';
  };

  const renderItineraryDetails = (itinerary: Itinerary) => {
    const days = [];
    const start = dayjs(itinerary.startDate);
    const end = dayjs(itinerary.endDate);
    const dayCount = end.diff(start, 'day') + 1;

    for (let i = 0; i < dayCount; i++) {
      const dayDate = start.add(i, 'day');
      const dayItinerary = itinerary.destinations.find((d) => d.day === i + 1);

      days.push(
        <div key={i} style={{ marginBottom: 16, padding: 12, backgroundColor: '#fafafa', borderRadius: 4 }}>
          <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
            Ngày {i + 1} - {dayDate.format('DD/MM/YYYY')}
          </div>
          {dayItinerary ? (
            <div>
              <Tag color="blue">{getDestinationName(dayItinerary.destinationId)}</Tag>
              <p style={{ margin: '8px 0 0 0', color: '#666' }}>{dayItinerary.notes}</p>
              <p style={{ margin: '4px 0 0 0', fontSize: 12, color: '#999' }}>
                Hoạt động: {dayItinerary.activities.join(', ') || 'Chưa có'}
              </p>
            </div>
          ) : (
            <p style={{ color: '#999', margin: 0 }}>Chưa lên kế hoạch</p>
          )}
        </div>,
      );
    }

    return days;
  };

  const collapseItems = itineraries.map((itinerary) => ({
    key: itinerary.id,
    header: (
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <span>
          <strong>{itinerary.title}</strong>
          <Tag color="default" style={{ marginLeft: 8 }}>
            {dayjs(itinerary.startDate).format('DD/MM')} - {dayjs(itinerary.endDate).format('DD/MM')}
          </Tag>
        </span>
        <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
          {itinerary.budget.toLocaleString()} {itinerary.currency}
        </span>
      </div>
    ),
    content: (
      <div>
        <p>{itinerary.description}</p>
        <div className={styles.itineraryDetails}>{renderItineraryDetails(itinerary)}</div>
        <Space>
          <Button size="small" icon={<DeleteOutlined />} onClick={() => handleDeleteItinerary(itinerary.id)} danger>
            Xóa
          </Button>
        </Space>
      </div>
    ),
  }));

  return (
    <div className={styles.container}>
      <Card
        title="Lịch trình du lịch"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            Tạo mới
          </Button>
        }
      >
        {itineraries.length > 0 ? (
          <Collapse accordion>{collapseItems.map((item) => (
            <Collapse.Panel header={item.header} key={item.key}>
              {item.content}
            </Collapse.Panel>
          ))}</Collapse>
        ) : (
          <p style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
            Chưa có lịch trình nào. Tạo một lịch trình mới để bắt đầu!
          </p>
        )}
      </Card>

      <Modal
        title="Tạo lịch trình mới"
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
        width={isMobile ? '95%' : 600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateItinerary}>
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Ví dụ: Chuyến đi Sapa 4 ngày 3 đêm" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea placeholder="Mô tả ngắn về lịch trình của bạn" rows={3} />
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Ngày đi - Ngày về"
            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
          >
            <DatePicker.RangePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="budget" label="Ngân sách (VND)">
                <Input type="number" placeholder="Nhập ngân sách" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="currency"
                label="Tiền tệ"
                initialValue="VND"
                rules={[{ required: true }]}
              >
                <Select options={[
                  { label: 'VND', value: 'VND' },
                  { label: 'USD', value: 'USD' },
                  { label: 'EUR', value: 'EUR' },
                ]} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ItineraryComponent;
