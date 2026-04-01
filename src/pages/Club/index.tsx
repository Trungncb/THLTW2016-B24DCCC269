import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Switch,
  Drawer,
  Card,
  message,
  Popconfirm,
  Tag,
  Image,
  DatePicker,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import * as ClubService from '@/services/Club';
import { ClubModel } from '@/models/club';
import moment from 'moment';
import RichTextEditor from '@/components/TinyEditor';
import styles from './index.less';

const Club: React.FC = () => {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClub, setEditingClub] = useState<ClubModel.Club | null>(null);
  const [memberDrawerVisible, setMemberDrawerVisible] = useState(false);
  const [selectedClub, setSelectedClub] = useState<ClubModel.Club | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [clubsData, setClubsData] = useState<ClubModel.Club[]>([]);
  const [clubsLoading, setClubsLoading] = useState(false);

  // Fetch clubs
  const fetchClubs = async () => {
    setClubsLoading(true);
    try {
      const response = await ClubService.getClubList({
        page: pagination.current,
        pageSize: pagination.pageSize,
        search: searchText,
      });
      setClubsData(response.data || []);
    } catch (error) {
      message.error('Lỗi tải danh sách câu lạc bộ');
    } finally {
      setClubsLoading(false);
    }
  };

  const refreshClubs = () => fetchClubs();

  const [membersData, setMembersData] = useState<any[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);

  const fetchMembers = async (clubId: string) => {
    setMembersLoading(true);
    try {
      const response = await ClubService.getClubMembers(clubId);
      setMembersData(response.data || []);
    } catch (error) {
      message.error('Lỗi tải danh sách thành viên');
    } finally {
      setMembersLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, [pagination, searchText]);

  const handleAdd = () => {
    form.resetFields();
    setEditingClub(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record: ClubModel.Club) => {
    setEditingClub(record);
    form.setFieldsValue({
      name: record.name,
      headmaster: record.headmaster,
      foundedDate: moment(record.foundedDate),
      description: record.description,
      active: record.active,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await ClubService.deleteClub(id);
      message.success('Xóa câu lạc bộ thành công');
      refreshClubs();
    } catch (error) {
      message.error('Xóa câu lạc bộ thất bại');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        foundedDate: values.foundedDate ? values.foundedDate.format('YYYY-MM-DD') : '',
      };

      if (editingClub) {
        await ClubService.updateClub({ ...payload, id: editingClub.id });
        message.success('Cập nhật câu lạc bộ thành công');
      } else {
        await ClubService.createClub(payload);
        message.success('Tạo câu lạc bộ thành công');
      }
      setIsModalVisible(false);
      refreshClubs();
    } catch (error) {
      message.error('Thao tác thất bại');
    }
  };

  const handleViewMembers = async (record: ClubModel.Club) => {
    setSelectedClub(record);
    setMemberDrawerVisible(true);
    fetchMembers(record.id);
  };

  const columns = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar: string) =>
        avatar ? <Image src={avatar} width={60} height={60} /> : <span>-</span>,
    },
    {
      title: 'Tên câu lạc bộ',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: ClubModel.Club, b: ClubModel.Club) =>
        a.name.localeCompare(b.name),
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'foundedDate',
      key: 'foundedDate',
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Chủ nhiệm',
      dataIndex: 'headmaster',
      key: 'headmaster',
    },
    {
      title: 'Hoạt động',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'red'}>
          {active ? 'Có' : 'Không'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 180,
      render: (_: any, record: ClubModel.Club) => (
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
            icon={<TeamOutlined />}
            size="small"
            onClick={() => handleViewMembers(record)}
          >
            Thành viên
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

  return (
    <div>
      <Card>
        <div className={styles.header}>
          <Input.Search
            placeholder="Tìm kiếm câu lạc bộ..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm mới
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={clubsData}
          loading={clubsLoading}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: clubsData?.length || 0,
            onChange: (page, pageSize) => {
              setPagination({ current: page, pageSize });
            },
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingClub ? 'Chỉnh sửa câu lạc bộ' : 'Thêm mới câu lạc bộ'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={700}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên câu lạc bộ"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên câu lạc bộ' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Ngày thành lập"
            name="foundedDate"
            rules={[{ required: true, message: 'Vui lòng chọn ngày thành lập' }]}
          >
            <DatePicker format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            label="Chủ nhiệm"
            name="headmaster"
            rules={[{ required: true, message: 'Vui lòng nhập tên chủ nhiệm' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: false }]}
          >
            <RichTextEditor />
          </Form.Item>

          <Form.Item
            label="Hoạt động"
            name="active"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      {/* Members Drawer */}
      <Drawer
        title={`Danh sách thành viên - ${selectedClub?.name}`}
        placement="right"
        onClose={() => setMemberDrawerVisible(false)}
        visible={memberDrawerVisible}
        width={800}
      >
        <Table
          dataSource={membersData}
          loading={membersLoading}
          rowKey="id"
          columns={[
            { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
            { title: 'Email', dataIndex: 'email', key: 'email' },
            { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
            { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
          ]}
          pagination={false}
        />
      </Drawer>
    </div>
  );
};

export default Club;
