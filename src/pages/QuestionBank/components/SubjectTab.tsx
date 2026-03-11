import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Space, Table, Modal, message, InputNumber } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { SubjectService } from '@/models/questionbank/services';
import { Subject } from '@/models/questionbank/types';

interface SubjectTabProps {
  onRefresh: () => void;
}

const SubjectTab: React.FC<SubjectTabProps> = ({ onRefresh }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setSubjects(SubjectService.getAll());
  };

  const handleAdd = async (values: any) => {
    if (editingId) {
      SubjectService.update(editingId, values);
      message.success('Cập nhật thành công!');
    } else {
      SubjectService.add(values);
      message.success('Thêm thành công!');
    }
    form.resetFields();
    setIsModalVisible(false);
    setEditingId(null);
    loadData();
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xóa môn học',
      content: 'Bạn chắc chắn muốn xóa?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: () => {
        SubjectService.delete(id);
        message.success('Xóa thành công!');
        loadData();
      },
    });
  };

  const handleEdit = (record: Subject) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'Mã môn',
      dataIndex: 'code',
      key: 'code',
      width: 100,
    },
    {
      title: 'Tên môn học',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tín chỉ',
      dataIndex: 'credits',
      key: 'credits',
      width: 80,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
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
        Thêm Môn Học
      </Button>

      <Table
        columns={columns}
        dataSource={subjects}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingId ? 'Sửa Môn Học' : 'Thêm Môn Học'}
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
            label="Mã môn"
            name="code"
            rules={[{ required: true, message: 'Vui lòng nhập mã môn!' }]}
          >
            <Input placeholder="VD: CS101" />
          </Form.Item>
          <Form.Item
            label="Tên môn học"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên môn!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tín chỉ"
            name="credits"
            rules={[{ required: true, message: 'Vui lòng nhập tín chỉ!' }]}
          >
            <InputNumber min={1} max={6} />
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

export default SubjectTab;
