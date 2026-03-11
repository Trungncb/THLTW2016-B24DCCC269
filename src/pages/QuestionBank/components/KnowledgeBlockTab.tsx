import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Space, Table, Modal, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { KnowledgeBlockService } from '@/models/questionbank/services';
import { KnowledgeBlock } from '@/models/questionbank/types';

const KnowledgeBlockTab: React.FC = () => {
  const [blocks, setBlocks] = useState<KnowledgeBlock[]>([]);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setBlocks(KnowledgeBlockService.getAll());
  };

  const handleAdd = async (values: any) => {
    if (editingId) {
      KnowledgeBlockService.update(editingId, values);
      message.success('Cập nhật thành công!');
    } else {
      KnowledgeBlockService.add(values);
      message.success('Thêm thành công!');
    }
    form.resetFields();
    setIsModalVisible(false);
    setEditingId(null);
    loadData();
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xóa khối kiến thức',
      content: 'Bạn chắc chắn muốn xóa?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: () => {
        KnowledgeBlockService.delete(id);
        message.success('Xóa thành công!');
        loadData();
      },
    });
  };

  const handleEdit = (record: KnowledgeBlock) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'Tên khối kiến thức',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: KnowledgeBlock) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setEditingId(null);
          form.resetFields();
          setIsModalVisible(true);
        }}
        style={{ marginBottom: '20px' }}
      >
        Thêm Khối Kiến Thức
      </Button>

      <Table
        columns={columns}
        dataSource={blocks}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingId ? 'Sửa Khối Kiến Thức' : 'Thêm Khối Kiến Thức'}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingId(null);
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item
            label="Tên khối kiến thức"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            {editingId ? 'Cập nhật' : 'Thêm'}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default KnowledgeBlockTab;
