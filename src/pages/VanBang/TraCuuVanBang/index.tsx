import { Form, Button, Input, DatePicker, InputNumber, Card, Table, Empty, Statistic, Row, Col, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useState } from 'react';
import { traCuuVanBang, getThongKeTrachuu, recordTraCuu } from '@/services/VanBang/tracuuvanbang';
import styles from './index.less';

const TraCuuVanBangPage = () => {
  const [form] = Form.useForm();
  const [results, setResults] = useState<ThongTinVanBang.IRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [thongKe, setThongKe] = useState<TraCuuVanBang.ITraCuuResult | null>(null);

  const handleSearch = async (values: any) => {
    // Kiểm tra ít nhất 2 tham số
    const filledParams = Object.keys(values).filter(
      (key) => values[key] !== null && values[key] !== undefined && values[key] !== ''
    ).length;

    if (filledParams < 2) {
      message.error('Vui lòng nhập ít nhất 2 tham số tìm kiếm');
      return;
    }

    setLoading(true);
    try {
      const params: TraCuuVanBang.ISearchParams = {};
      if (values.soHieuVanBang) params.soHieuVanBang = values.soHieuVanBang;
      if (values.soVaoSo) params.soVaoSo = values.soVaoSo;
      if (values.maSinhVien) params.maSinhVien = values.maSinhVien;
      if (values.hoTen) params.hoTen = values.hoTen;
      if (values.ngaySinh) params.ngaySinh = values.ngaySinh.toDate();

      const response = await traCuuVanBang(params);
      setResults(response.data || []);

      // Ghi nhận tra cứu
      if (response.data && response.data.length > 0 && response.data[0]._id) {
        await recordTraCuu(response.data[0]._id, values);
      }

      // Lấy thống kê
      const stats = await getThongKeTrachuu();
      setThongKe(stats);
    } catch (error) {
      message.error('Có lỗi xảy ra khi tìm kiếm');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Số vào sổ',
      dataIndex: 'soVaoSo',
      width: 100,
    },
    {
      title: 'Số hiệu văn bằng',
      dataIndex: 'soHieuVanBang',
      width: 180,
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'maSinhVien',
      width: 120,
    },
    {
      title: 'Họ tên',
      dataIndex: 'hoTen',
      width: 200,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'ngaySinh',
      width: 120,
      render: (val: any) => moment(val).format('DD/MM/YYYY'),
    },
    {
      title: 'Xếp hạng',
      dataIndex: 'xepHang',
      width: 100,
    },
  ];

  return (
    <div className={styles.container}>
      <Card title="Tra cứu Văn Bằng" bordered={false} style={{ marginBottom: 24 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSearch}
        >
          <Row gutter={24}>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item
                name="soHieuVanBang"
                label="Số hiệu văn bằng"
              >
                <Input placeholder="VD: .../001" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item
                name="soVaoSo"
                label="Số vào sổ"
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item
                name="maSinhVien"
                label="Mã sinh viên"
              >
                <Input placeholder="VD: 20210001" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item
                name="hoTen"
                label="Họ tên"
              >
                <Input placeholder="Nhập họ tên" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item
                name="ngaySinh"
                label="Ngày sinh"
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item label=" ">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SearchOutlined />}
                  block
                >
                  Tìm kiếm
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <p style={{ color: '#999', fontSize: 12 }}>
          * Vui lòng nhập ít nhất 2 tham số để tìm kiếm
        </p>
      </Card>

      {thongKe && (
        <Card title="Thống kê tra cứu" bordered={false} style={{ marginBottom: 24 }}>
          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Statistic
                title="Tổng lượt tra cứu"
                value={thongKe.tongSoLuotTraCuu}
              />
            </Col>
            {thongKe.chiTiet.length > 0 && (
              <Col xs={24} sm={12}>
                <Statistic
                  title="Đợt được tra cứu nhiều nhất"
                  value={thongKe.chiTiet[0].soQD}
                />
              </Col>
            )}
          </Row>
          <Table
            dataSource={thongKe.chiTiet}
            columns={[
              {
                title: 'Số QĐ',
                dataIndex: 'soQD',
              },
              {
                title: 'Lượt tra cứu',
                dataIndex: 'soLuot',
              },
            ]}
            pagination={false}
            style={{ marginTop: 16 }}
            rowKey="quyetDinhId"
          />
        </Card>
      )}

      {results.length > 0 ? (
        <Card title={`Kết quả tìm kiếm (${results.length} kết quả)`} bordered={false}>
          <Table
            columns={columns}
            dataSource={results}
            rowKey="_id"
            pagination={false}
          />
        </Card>
      ) : (
        results.length === 0 && !loading && (
          <Card bordered={false}>
            <Empty description="Chưa có kết quả tìm kiếm" />
          </Card>
        )
      )}
    </div>
  );
};

export default TraCuuVanBangPage;
