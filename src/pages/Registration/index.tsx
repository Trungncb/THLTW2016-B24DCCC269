import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Drawer,
  Card,
  message,
  Popconfirm,
  Tag,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import * as RegistrationService from '@/services/Registration';
import * as ClubService from '@/services/Club';
import { RegistrationModel } from '@/models/registration';
import { ClubModel } from '@/models/club';
import moment from 'moment';
import styles from './index.less';

const Registration: React.FC = () => {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState<RegistrationModel.Registration | null>(null);
  const [historyDrawerVisible, setHistoryDrawerVisible] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationModel.Registration | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // State management
  const [registrationsData, setRegistrationsData] = useState<RegistrationModel.Registration[]>([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);
  const [clubsData, setClubsData] = useState<ClubModel.Club[]>([]);
  const [historyData, setHistoryData] = useState<RegistrationModel.ActionHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Fetch registrations
  const fetchRegistrations = async () => {
    setRegistrationsLoading(true);
    try {
      const response = await RegistrationService.getRegistrationList({
        page: pagination.current,
        pageSize: pagination.pageSize,
      });
      setRegistrationsData(response.data || []);
    } catch (error) {
      message.error('Lỗi tải danh sách đơn đăng ký');
    } finally {
      setRegistrationsLoading(false);
    }
  };

  const refreshRegistrations = () => fetchRegistrations();

  // Fetch clubs
  const fetchClubs = async () => {
    try {
      const response = await ClubService.getClubList();
      setClubsData(response.data || []);
    } catch (error) {
      message.error('Lỗi tải danh sách câu lạc bộ');
    }
  };

  // Fetch action history
  const fetchHistory = async (registrationId: string) => {
    setHistoryLoading(true);
    try {
      const response = await RegistrationService.getActionHistory(registrationId);
      setHistoryData(response.data || []);
    } catch (error) {
      message.error('Lỗi tải lịch sử');
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
    fetchClubs();
  }, [pagination]);

  const handleAdd = () => {
    form.resetFields();
    setEditingRegistration(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record: RegistrationModel.Registration) => {
    setEditingRegistration(record);
    form.setFieldsValue({
      fullName: record.fullName,
      email: record.email,
      phone: record.phone,
      gender: record.gender,
      address: record.address,
      specialty: record.specialty,
      clubId: record.clubId,
      reason: record.reason,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await RegistrationService.deleteRegistration(id);
      message.success('Xóa đơn đăng ký thành công');
      refreshRegistrations();
    } catch (error) {
      message.error('Xóa đơn đăng ký thất bại');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRegistration) {
        await RegistrationService.updateRegistration({
          ...values,
          id: editingRegistration.id,
        });
        message.success('Cập nhật đơn đăng ký thành công');
      } else {
        await RegistrationService.createRegistration(values);
        message.success('Tạo đơn đăng ký thành công');
      }
      setIsModalVisible(false);
      refreshRegistrations();
    } catch (error) {
      message.error('Thao tác thất bại');
    }
  };

  const handleApprove = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Vui lòng chọn ít nhất một đơn đăng ký');
      return;
    }
    try {
      await RegistrationService.approveRegistrations({
        registrationIds: selectedRowKeys,
      });
      message.success(`Đã duyệt ${selectedRowKeys.length} đơn đăng ký`);
      setSelectedRowKeys([]);
      refreshRegistrations();
    } catch (error) {
      message.error('Duyệt thất bại');
    }
  };

  const handleReject = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Vui lòng chọn ít nhất một đơn đăng ký');
      return;
    }
    setRejectModalVisible(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      message.warning('Vui lòng nhập lý do từ chối');
      return;
    }
    try {
      await RegistrationService.rejectRegistrations({
        registrationIds: selectedRowKeys,
        rejectionReason: rejectReason,
      });
      message.success(`Đã từ chối ${selectedRowKeys.length} đơn đăng ký`);
      setSelectedRowKeys([]);
      setRejectModalVisible(false);
      setRejectReason('');
      refreshRegistrations();
    } catch (error) {
      message.error('Từ chối thất bại');
    }
  };

  const handleViewHistory = async (record: RegistrationModel.Registration) => {
    setSelectedRegistration(record);
    setHistoryDrawerVisible(true);
    fetchHistory(record.id);
  };

  const getStatusColor = (status: RegistrationModel.RegistrationStatus) => {
    switch (status) {
      case RegistrationModel.RegistrationStatus.PENDING:
        return 'orange';
      case RegistrationModel.RegistrationStatus.APPROVED:
        return 'green';
      case RegistrationModel.RegistrationStatus.REJECTED:
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: RegistrationModel.RegistrationStatus) => {
    switch (status) {
      case RegistrationModel.RegistrationStatus.PENDING:
        return 'Chờ duyệt';
      case RegistrationModel.RegistrationStatus.APPROVED:
        return 'Đã duyệt';
      case RegistrationModel.RegistrationStatus.REJECTED:
        return 'Từ chối';
      default:
        return status;
    }
  };

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Sở trường',
      dataIndex: 'specialty',
      key: 'specialty',
    },
    {
      title: 'Câu lạc bộ',
      dataIndex: 'clubName',
      key: 'clubName',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: RegistrationModel.RegistrationStatus) => (
        <Tag color={getStatusColor(status)}>
          {getStatusLabel(status)}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 220,
      render: (_: any, record: RegistrationModel.Registration) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            icon={<HistoryOutlined />}
            size="small"
            onClick={() => handleViewHistory(record)}
          >
            Lịch sử
          </Button>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: any[]) => {
      setSelectedRowKeys(keys.map((k) => String(k)));
    },
  };

  return (
    <div>
      <Card>
        <div className={styles.header}>
          <Input.Search
            placeholder="Tìm kiếm đơn đăng ký..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Space>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={handleApprove}
              disabled={selectedRowKeys.length === 0}
            >
              Duyệt {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
            </Button>
            <Button
              danger
              icon={<CloseOutlined />}
              onClick={handleReject}
              disabled={selectedRowKeys.length === 0}
            >
              Từ chối {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Thêm mới
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={registrationsData}
          loading={registrationsLoading}
          rowKey="id"
          rowSelection={rowSelection}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: registrationsData?.length || 0,
            onChange: (page, pageSize) => {
              setPagination({ current: page, pageSize });
            },
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingRegistration ? 'Chỉnh sửa đơn đăng ký' : 'Thêm mới đơn đăng ký'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={700}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Họ tên"
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input type="email" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
          >
            <Select placeholder="Chọn giới tính">
              <Select.Option value={RegistrationModel.Gender.MALE}>Nam</Select.Option>
              <Select.Option value={RegistrationModel.Gender.FEMALE}>Nữ</Select.Option>
              <Select.Option value={RegistrationModel.Gender.OTHER}>Khác</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Sở trường"
            name="specialty"
            rules={[{ required: true, message: 'Vui lòng nhập sở trường' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Câu lạc bộ"
            name="clubId"
            rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ' }]}
          >
            <Select placeholder="Chọn câu lạc bộ">
              {clubsData?.map((club: ClubModel.Club) => (
                <Select.Option key={club.id} value={club.id}>
                  {club.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Lý do đăng ký"
            name="reason"
            rules={[{ required: true, message: 'Vui lòng nhập lý do đăng ký' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Reject Reason Modal */}
      <Modal
        title="Nhập lý do từ chối"
        visible={rejectModalVisible}
        onOk={handleRejectConfirm}
        onCancel={() => {
          setRejectModalVisible(false);
          setRejectReason('');
        }}
      >
        <Form layout="vertical">
          <Form.Item label="Lý do từ chối">
            <Input.TextArea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Nhập lý do từ chối đơn đăng ký..."
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* History Drawer */}
      <Drawer
        title={`Lịch sử thao tác - ${selectedRegistration?.fullName}`}
        placement="right"
        onClose={() => setHistoryDrawerVisible(false)}
        visible={historyDrawerVisible}
        width={800}
      >
        <Table
          dataSource={historyData}
          loading={historyLoading}
          rowKey="id"
          columns={[
            {
              title: 'Thao tác',
              dataIndex: 'action',
              key: 'action',
              render: (action: string) => {
                let color = 'default';
                let label = action;
                if (action === 'APPROVED') {
                  color = 'green';
                  label = 'Đã duyệt';
                } else if (action === 'REJECTED') {
                  color = 'red';
                  label = 'Từ chối';
                }
                return <Tag color={color}>{label}</Tag>;
              },
            },
            {
              title: 'Người thực hiện',
              dataIndex: 'adminName',
              key: 'adminName',
            },
            {
              title: 'Thời gian',
              dataIndex: 'timestamp',
              key: 'timestamp',
              render: (timestamp: string) => moment(timestamp).format('DD/MM/YYYY HH:mm'),
            },
            {
              title: 'Chi tiết',
              dataIndex: 'details',
              key: 'details',
            },
          ]}
          pagination={false}
        />
      </Drawer>
    </div>
  );
};

export default Registration;
