import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip, Tag } from 'antd';
import { useModel } from 'umi';
import Form from './components/Form';

const ConfigBieuMauPage = () => {
  const { getModel, page, limit, deleteModel, handleEdit } = useModel('vanbang.configbieumauvanbang');

  const columns: IColumn<ConfigBieuMauVanBang.IRecord>[] = [
    {
      title: 'Tên biểu mẫu',
      dataIndex: 'ten',
      width: 250,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Mô tả',
      dataIndex: 'mieuTa',
      width: 300,
    },
    {
      title: 'Số trường',
      dataIndex: 'cacTruong',
      width: 100,
      align: 'center',
      render: (fields) => fields?.length || 0,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThaiSuDung',
      width: 120,
      align: 'center',
      render: (val) => (
        <Tag color={val ? 'green' : 'red'}>
          {val ? 'Sử dụng' : 'Không sử dụng'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 100,
      fixed: 'right',
      render: (record: ConfigBieuMauVanBang.IRecord) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => record._id && deleteModel(record._id, getModel)}
              title="Bạn có chắc chắn muốn xóa cấu hình này?"
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
      modelName="vanbang.configbieumauvanbang"
      title="Cấu Hình Biểu Mẫu Văn Bằng"
      Form={Form}
      buttons={{ import: true }}
    />
  );
};

export default ConfigBieuMauPage;
