import React, { useState } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Modal,
  Form,
  Popconfirm,
  message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

interface Post {
  id: string;
  title: string;
  status: 'draft' | 'published';
  tags: string[];
  views: number;
  createdAt: string;
}

const initialData: Post[] = [
  {
    id: '1',
    title: 'Học React cơ bản',
    status: 'published',
    tags: ['react', 'js'],
    views: 120,
    createdAt: '2026-04-20',
  },
];

export default function QuanLiBaiViet() {
  const [data, setData] = useState<Post[]>(initialData);
  const [filtered, setFiltered] = useState<Post[]>(initialData);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form] = Form.useForm();

  // SEARCH + FILTER
  const handleFilter = () => {
    let result = [...data];

    if (search) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      result = result.filter((item) => item.status === status);
    }

    setFiltered(result);
  };

  // OPEN MODAL
  const openForm = (record?: Post) => {
    if (record) {
      setEditing(record);
      form.setFieldsValue(record);
    } else {
      setEditing(null);
      form.resetFields();
    }
    setOpen(true);
  };

  // SAVE
  const handleSubmit = (values: Post) => {
    if (editing) {
      const newData = data.map((item) =>
        item.id === editing.id ? { ...editing, ...values } : item
      );
      setData(newData);
      setFiltered(newData);
      message.success('Đã cập nhật');
    } else {
      const newItem: Post = {
        ...values,
        id: Date.now().toString(),
        views: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      const newData = [...data, newItem];
      setData(newData);
      setFiltered(newData);
      message.success('Đã thêm');
    }

    setOpen(false);
    form.resetFields();
  };

  // DELETE
  const handleDelete = (id: string) => {
    const newData = data.filter((item) => item.id !== id);
    setData(newData);
    setFiltered(newData);
    message.success('Đã xóa');
  };

  const columns: ColumnsType<Post> = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (s) => (
        <Tag color={s === 'published' ? 'green' : 'orange'}>
          {s === 'published' ? 'Đã đăng' : 'Nháp'}
        </Tag>
      ),
    },
    {
      title: 'Thẻ',
      dataIndex: 'tags',
      render: (tags: string[]) =>
        tags.map((t) => <Tag key={t}>{t}</Tag>),
    },
    {
      title: 'Lượt xem',
      dataIndex: 'views',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
    },
    {
      title: 'Hành động',
      render: (_, record) => (
        <Space>
          <Button onClick={() => openForm(record)}>Sửa</Button>
          <Popconfirm
            title="Xóa bài?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Quản lý bài viết</h2>

      {/* FILTER */}
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm tiêu đề"
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select
          placeholder="Trạng thái"
          style={{ width: 150 }}
          allowClear
          onChange={(v) => setStatus(v)}
        >
          <Option value="draft">Nháp</Option>
          <Option value="published">Đã đăng</Option>
        </Select>

        <Button onClick={handleFilter}>Lọc</Button>

        <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm()}>
          Thêm
        </Button>
      </Space>

      {/* TABLE */}
      <Table columns={columns} dataSource={filtered} rowKey="id" />

      {/* MODAL */}
      <Modal
        title={editing ? 'Sửa bài viết' : 'Thêm bài viết'}
        visible={open}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="tags"
            label="Thẻ"
            rules={[{ required: true }]}
          >
            <Select mode="tags" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="draft">Nháp</Option>
              <Option value="published">Đã đăng</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}