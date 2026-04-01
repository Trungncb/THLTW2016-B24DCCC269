import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Select,
  Card,
  message,
  Popconfirm,
  Modal,
  Form,
} from 'antd';
import {
  DeleteOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import * as MemberService from '@/services/Member';
import * as ClubService from '@/services/Club';
import { MemberModel } from '@/models/member';
import { ClubModel } from '@/models/club';
import moment from 'moment';
import styles from './index.less';

const Member: React.FC = () => {
  const [selectedClubId, setSelectedClubId] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [targetClubId, setTargetClubId] = useState<string>('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // State management
  const [clubsData, setClubsData] = useState<ClubModel.Club[]>([]);
  const [membersData, setMembersData] = useState<MemberModel.Member[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);

  // Fetch clubs
  const fetchClubs = async () => {
    try {
      const response = await ClubService.getClubList();
      setClubsData(response.data || []);
    } catch (error) {
      message.error('Lỗi tải danh sách câu lạc bộ');
    }
  };

  // Fetch members by club
  const fetchMembers = async () => {
    if (!selectedClubId) {
      setMembersData([]);
      return;
    }
    setMembersLoading(true);
    try {
      const response = await MemberService.getMemberListByClub(selectedClubId, {
        page: pagination.current,
        pageSize: pagination.pageSize,
      });
      setMembersData(response.data || []);
    } catch (error) {
      message.error('Lỗi tải danh sách thành viên');
    } finally {
      setMembersLoading(false);
    }
  };

  const refreshMembers = () => fetchMembers();

  useEffect(() => {
    fetchClubs();
  }, []);

  useEffect(() => {
    if (selectedClubId) {
      fetchMembers();
    }
  }, [selectedClubId, pagination]);

  const handleClubChange = (clubId: string) => {
    setSelectedClubId(clubId);
    setSelectedRowKeys([]);
    setPagination({ current: 1, pageSize: 10 });
  };

  const handleDelete = async (id: string) => {
    try {
      await MemberService.removeMember(id);
      message.success('Xóa thành viên thành công');
      refreshMembers();
    } catch (error) {
      message.error('Xóa thành viên thất bại');
    }
  };

  const handleTransferClick = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Vui lòng chọn ít nhất một thành viên');
      return;
    }
    setTransferModalVisible(true);
  };

  const handleTransferConfirm = async () => {
    if (!targetClubId) {
      message.warning('Vui lòng chọn câu lạc bộ đích');
      return;
    }
    try {
      await MemberService.transferMembers({
        memberIds: selectedRowKeys,
        targetClubId,
      });
      message.success(`Đã chuyển ${selectedRowKeys.length} thành viên sang câu lạc bộ khác`);
      setSelectedRowKeys([]);
      setTransferModalVisible(false);
      setTargetClubId('');
      refreshMembers();
    } catch (error) {
      message.error('Chuyển thành viên thất bại');
    }
  };

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a: MemberModel.Member, b: MemberModel.Member) =>
        a.fullName.localeCompare(b.fullName),
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
      title: 'Ngày tham gia',
      dataIndex: 'joinedDate',
      key: 'joinedDate',
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_: any, record: MemberModel.Member) => (
        <Space>
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

  const targetClubOptions = clubsData?.filter(
    (club: ClubModel.Club) => club.id !== selectedClubId
  ) || [];

  return (
    <div>
      <Card>
        <div className={styles.header}>
          <div className={styles.controls}>
            <span>Chọn câu lạc bộ:</span>
            <Select
              placeholder="Chọn câu lạc bộ"
              value={selectedClubId}
              onChange={handleClubChange}
              style={{ width: 300 }}
              options={clubsData?.map((club: ClubModel.Club) => ({
                label: club.name,
                value: club.id,
              }))}
            />
          </div>
          <Button
            type="primary"
            icon={<SwapOutlined />}
            onClick={handleTransferClick}
            disabled={selectedRowKeys.length === 0 || !selectedClubId}
          >
            Chuyển CLB {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
          </Button>
        </div>

        {selectedClubId && (
          <Table
            columns={columns}
            dataSource={membersData}
            loading={membersLoading}
            rowKey="id"
            rowSelection={rowSelection}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: membersData?.length || 0,
              onChange: (page, pageSize) => {
                setPagination({ current: page, pageSize });
              },
            }}
          />
        )}
      </Card>

      {/* Transfer Modal */}
      <Modal
        title={`Chuyển ${selectedRowKeys.length} thành viên`}
        visible={transferModalVisible}
        onOk={handleTransferConfirm}
        onCancel={() => {
          setTransferModalVisible(false);
          setTargetClubId('');
        }}
        destroyOnClose
      >
        <Form layout="vertical">
          <Form.Item label="Chuyển tới câu lạc bộ">
            <Select
              placeholder="Chọn câu lạc bộ đích"
              value={targetClubId}
              onChange={setTargetClubId}
              options={targetClubOptions?.map((club: ClubModel.Club) => ({
                label: club.name,
                value: club.id,
              }))}
            />
          </Form.Item>
          <p>
            Bạn sắp chuyển <strong>{selectedRowKeys.length}</strong> thành viên từ{' '}
            <strong>
              {clubsData?.find((c: ClubModel.Club) => c.id === selectedClubId)?.name}
            </strong>{' '}
            sang câu lạc bộ khác.
          </p>
        </Form>
      </Modal>
    </div>
  );
};

export default Member;
