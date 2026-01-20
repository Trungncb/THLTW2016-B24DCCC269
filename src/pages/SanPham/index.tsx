import React from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Card,
  Modal,
  Popconfirm,
  Tooltip,
  Empty,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';
import ProductForm from './Form';
import styles from './index.less';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const SanPhamPage: React.FC = () => {
  const {
    products,
    visible,
    setVisible,
    searchText,
    setSearchText,
    handleAddNew,
    handleEditProduct,
    handleDeleteProduct,
    handleCloseModal,
  } = useModel('sanpham');

  const columns: any[] = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      ellipsis: true,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      align: 'right',
      render: (price: number) =>
        price.toLocaleString('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'center',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      align: 'center',
      fixed: 'right' as const,
      render: (_: any, record: Product) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEditProduct(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xác nhận xóa"
              description="Bạn có chắc chắn muốn xóa sản phẩm này?"
              okText="Xóa"
              cancelText="Hủy"
              onConfirm={() => handleDeleteProduct(record.id)}
              okButtonProps={{ danger: true }}
            >
              <Button danger type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Card
        title={<h2>Quản lý Sản phẩm</h2>}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddNew}
          >
            Thêm sản phẩm
          </Button>
        }
        className={styles.card}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Input.Search
            placeholder="Tìm kiếm theo tên sản phẩm..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ maxWidth: 400 }}
          />

          <Table
            columns={columns}
            dataSource={products}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} sản phẩm`,
              showQuickJumper: true,
            }}
            scroll={{ x: 800 }}
            locale={{
              emptyText: (
                <Empty
                  description="Không có sản phẩm nào"
                  style={{ marginTop: 48, marginBottom: 48 }}
                />
              ),
            }}
          />
        </Space>
      </Card>

      <Modal
        title={null}
        open={visible}
        footer={null}
        onCancel={handleCloseModal}
        destroyOnClose
        centered
        width={600}
      >
        <ProductForm />
      </Modal>
    </div>
  );
};

export default SanPhamPage;
