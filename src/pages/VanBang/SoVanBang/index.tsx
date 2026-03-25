import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined, LockOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip, Space } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import Form from './components/Form';

const SoVanBangPage = () => {
  const { getModel, page, limit, deleteModel, handleEdit } = useModel('vanbang.sovanbang');

  const columns: IColumn<SoVanBang.IRecord>[] = [
    {
      title: 'Năm',
      dataIndex: 'nam',
      width: 80,
      filterType: 'select',
      sortable: true,
    },
    {
      title: 'Số thứ tự',
      dataIndex: 'soThuTu',
      width: 100,
      sortable: true,
    },
    {
      title: 'Số dòng đã cấp',
      dataIndex: 'soDangMo',
      width: 120,
      align: 'center',
    },
    {
      title: 'Ngày mở',
      dataIndex: 'ngayMo',
      width: 120,
      align: 'center',
      render: (val) => moment(val).format('DD/MM/YYYY'),
    },
    {
      title: 'Ngày đóng',
      dataIndex: 'ngayDong',
      width: 120,
      align: 'center',
      render: (val) => (val ? moment(val).format('DD/MM/YYYY') : '-'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThaiMo',
      width: 100,
      align: 'center',
      render: (val) => (val === 'MO' ? 'Mở' : 'Đóng'),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (record: SoVanBang.IRecord) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          {record.trangThaiMo === 'MO' && (
            <Tooltip title="Đóng sổ">
              <Button type="link" icon={<LockOutlined />} />
            </Tooltip>
          )}
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => record._id && deleteModel(record._id, getModel)}
              title="Bạn có chắc chắn muốn xóa sổ này?"
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
      modelName="vanbang.sovanbang"
      title="Sổ Văn Bằng"
      Form={Form}
      buttons={{ import: true }}
    />
  );
};

export default SoVanBangPage;
