import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip, Space } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import Form from './components/Form';

const ThongTinVanBangPage = () => {
  const { getModel, page, limit, deleteModel, handleEdit } = useModel('vanbang.thongtinvanbang');

  const columns: IColumn<ThongTinVanBang.IRecord>[] = [
    {
      title: 'Số vào sổ',
      dataIndex: 'soVaoSo',
      width: 100,
      align: 'center',
      sortable: true,
    },
    {
      title: 'Số hiệu văn bằng',
      dataIndex: 'soHieuVanBang',
      width: 200,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'maSinhVien',
      width: 120,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Họ tên',
      dataIndex: 'hoTen',
      width: 200,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'ngaySinh',
      width: 120,
      align: 'center',
      render: (val) => moment(val).format('DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (record: ThongTinVanBang.IRecord) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button type="link" icon={<EyeOutlined />} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => record._id && deleteModel(record._id, getModel)}
              title="Bạn có chắc chắn muốn xóa thông tin này?"
              placement="topLeft"
            >
              <Button danger type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <TableBase
      columns={columns}
      dependencies={[page, limit]}
      modelName="vanbang.thongtinvanbang"
      title="Thông Tin Văn Bằng"
      Form={Form}
      buttons={{ import: true }}
    />
  );
};

export default ThongTinVanBangPage;
