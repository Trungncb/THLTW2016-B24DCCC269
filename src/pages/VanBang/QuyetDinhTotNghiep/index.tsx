import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import Form from './components/Form';

const QuyetDinhTotNghiepPage = () => {
  const { getModel, page, limit, deleteModel, handleEdit } = useModel('vanbang.quyetdinhtotghiep');

  const columns: IColumn<QuyetDinhTotNghiep.IRecord>[] = [
    {
      title: 'Số QĐ',
      dataIndex: 'soQD',
      width: 150,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Năm',
      dataIndex: 'nam',
      width: 80,
      filterType: 'select',
      sortable: true,
    },
    {
      title: 'Đợt',
      dataIndex: 'dot',
      width: 60,
      align: 'center',
    },
    {
      title: 'Ngày ban hành',
      dataIndex: 'ngayBanHanh',
      width: 120,
      align: 'center',
      render: (val) => moment(val).format('DD/MM/YYYY'),
    },
    {
      title: 'Trích yếu',
      dataIndex: 'trichYeu',
      width: 300,
      render: (val) => val?.slice(0, 100) + (val?.length > 100 ? '...' : ''),
    },
    {
      title: 'Số học viên dự kiến',
      dataIndex: 'soHocVienDuDKi',
      width: 150,
      align: 'center',
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 100,
      fixed: 'right',
      render: (record: QuyetDinhTotNghiep.IRecord) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => record._id && deleteModel(record._id, getModel)}
              title="Bạn có chắc chắn muốn xóa quyết định này?"
              placement="topLeft"
            >
              <Button danger type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <TableBase
      columns={columns}
      dependencies={[page, limit]}
      modelName="vanbang.quyetdinhtotghiep"
      title="Quyết Định Tốt Nghiệp"
      Form={Form}
      buttons={{ import: true }}
    />
  );
};

export default QuyetDinhTotNghiepPage;
