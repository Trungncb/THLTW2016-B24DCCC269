import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useStudy, Subject } from '@/models/study';

export const SubjectManager: React.FC = () => {
  const { subjects, addSubject, updateSubject, deleteSubject } = useStudy();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [form] = Form.useForm();

  const columns: ColumnsType<Subject> = [
    {
      title: 'Tên môn',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              setEditing(record);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}
          >
            Sửa
          </Button>
          <Button
            size="small"
            danger
            onClick={() => {
              Modal.confirm({
                title: 'Xóa môn học',
                content: 'Bạn chắc chắn muốn xóa môn này?',
                onOk: () => {
                  deleteSubject(record.id);
                  message.success('Đã xóa');
                },
              });
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        updateSubject(editing.id, values.name);
        message.success('Cập nhật thành công');
      } else {
        addSubject(values.name);
        message.success('Thêm thành công');
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditing(null);
    } catch (err) {
      // ignore
    }
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: 16 }}
      >
        Thêm môn học
      </Button>
      <Table columns={columns} dataSource={subjects} rowKey="id" />

      <Modal
        title={editing ? 'Sửa môn học' : 'Thêm môn học'}
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditing(null);
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên môn"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên môn' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
