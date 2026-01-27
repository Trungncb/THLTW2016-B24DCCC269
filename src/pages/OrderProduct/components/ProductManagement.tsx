import React, { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Slider,
  Tag,
  message,
  Card,
  Row,
  Col,
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Product, useProduct } from '@/models/product';

const PAGE_SIZE = 5;

export const ProductManagement: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, getCategories, getProductStatus } =
    useProduct();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  // Search and Filter states
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000000]);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'quantity'>('name');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(() => getCategories(), [getCategories]);

  // Filtered and sorted data
  const filteredAndSortedData = useMemo(() => {
    let filtered = products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchText.toLowerCase());
      const matchCategory = !selectedCategory || p.category === selectedCategory;
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchStatus =
        !selectedStatus || getProductStatus(p.quantity) === selectedStatus;

      return matchSearch && matchCategory && matchPrice && matchStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'quantity':
          return b.quantity - a.quantity;
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchText, selectedCategory, priceRange, selectedStatus, sortBy, getProductStatus]);

  const columns: ColumnsType<Product> = [
    {
      title: 'STT',
      key: 'index',
      render: (_, __, index) => index + 1,
      width: 50,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <span>{price.toLocaleString('vi-VN')} đ</span>,
    },
    {
      title: 'Số lượng tồn kho',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity) => <span>{quantity}</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'quantity',
      key: 'status',
      render: (quantity) => {
        const status = getProductStatus(quantity);
        let color = 'green';
        if (status === 'Sắp hết') color = 'orange';
        if (status === 'Hết hàng') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    form.setFieldsValue(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Xóa sản phẩm',
      content: 'Bạn chắc chắn muốn xóa sản phẩm này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: () => {
        deleteProduct(id);
        message.success('Xóa sản phẩm thành công');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        updateProduct(editingId, values);
        message.success('Cập nhật sản phẩm thành công');
      } else {
        addProduct(values);
        message.success('Thêm sản phẩm thành công');
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingId(null);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingId(null);
  };

  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div style={{ padding: '20px' }}>
      <Card>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          style={{ marginBottom: '20px' }}
        >
          Thêm sản phẩm
        </Button>

        {/* Filters */}
        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Tìm kiếm sản phẩm"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Lọc theo danh mục"
              allowClear
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={categories.map((c) => ({ label: c, value: c }))}
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Lọc theo trạng thái"
              allowClear
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={[
                { label: 'Còn hàng', value: 'Còn hàng' },
                { label: 'Sắp hết', value: 'Sắp hết' },
                { label: 'Hết hàng', value: 'Hết hàng' },
              ]}
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Select
              value={sortBy}
              onChange={setSortBy}
              options={[
                { label: 'Tên A-Z', value: 'name' },
                { label: 'Giá thấp-cao', value: 'price-asc' },
                { label: 'Giá cao-thấp', value: 'price-desc' },
                { label: 'Số lượng', value: 'quantity' },
              ]}
            />
          </Col>
        </Row>

        {/* Price Range Slider */}
        <Row style={{ marginBottom: '20px' }}>
          <Col xs={24}>
            <label>Khoảng giá: {priceRange[0].toLocaleString('vi-VN')} - {priceRange[1].toLocaleString('vi-VN')} đ</label>
            <Slider
              range
              min={0}
              max={35000000}
              step={1000000}
              value={priceRange}
              onChange={(value) => {
                setPriceRange(value as [number, number]);
                setCurrentPage(1);
              }}
            />
          </Col>
        </Row>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={paginatedData}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize: PAGE_SIZE,
            total: filteredAndSortedData.length,
            onChange: setCurrentPage,
          }}
        />
      </Card>

      {/* Modal */}
      <Modal
        title={editingId ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
        visible={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            quantity: 0,
            price: 0,
          }}
        >
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Danh mục"
            name="category"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Input placeholder="Nhập danh mục" />
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[
              { required: true, message: 'Vui lòng nhập giá' },
              { type: 'number', min: 0, message: 'Giá phải lớn hơn 0' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>

          <Form.Item
            label="Số lượng tồn kho"
            name="quantity"
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng' },
              { type: 'number', min: 0, message: 'Số lượng phải lớn hơn hoặc bằng 0' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
