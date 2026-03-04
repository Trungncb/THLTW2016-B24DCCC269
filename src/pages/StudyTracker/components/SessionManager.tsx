import React, { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Space,
  message,
  Select,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useStudy, Session, Subject } from '@/models/study';

export const SessionManager: React.FC = () => {
  const {
    subjects,
    sessions,
    addSession,
    updateSession,
    deleteSession,
  } = useStudy();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Session | null>(null);
  const [form] = Form.useForm();

  const columns: ColumnsType<Session> = [
    {
      title: 'Môn học',
      dataIndex: 'subjectId',
      key: 'subjectId',
      render: (id) => subjects.find((s) => s.id === id)?.name || '',
    },
    {
      title: 'Ngày giờ',
      dataIndex: 'date',
      key: 'date',
      render: (d) => dayjs(d).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Thời lượng (phút)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
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
              form.setFieldsValue({
                ...record,
                date: dayjs(record.date),
              });
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
                title: 'Xóa buổi học',
                content: 'Bạn chắc chắn muốn xóa ?',
                onOk: () => {
                  deleteSession(record.id);
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
      const payload: Omit<Session, 'id'> = {
        subjectId: values.subjectId,
        date: values.date.format('YYYY-MM-DDTHH:mm'),
        duration: values.duration,
        content: values.content,
        note: values.note,
      };
      if (editing) {
        updateSession(editing.id, payload);
        message.success('Cập nhật thành công');
      } else {
        addSession(payload);
        message.success('Thêm thành công');
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditing(null);
    } catch (err) {}
  };

  return (
    <div style={{ padding: '24px' }}>
      <Button
        type="primary"
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: 24 }}
      >
        Thêm buổi học
      </Button>
      <Table columns={columns} dataSource={sessions} rowKey="id" bordered scroll={{ x: true }} />

      <Modal
        title={editing ? 'Sửa buổi học' : 'Thêm buổi học'}
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditing(null);
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Môn học"
            name="subjectId"
            rules={[{ required: true, message: 'Chọn môn học' }]}
          >
            <Select options={subjects.map((s) => ({ label: s.name, value: s.id }))} />
          </Form.Item>
          <Form.Item
            label="Ngày giờ"
            name="date"
            rules={[{ required: true, message: 'Chọn thời gian' }]}
          >
            <DatePicker showTime />
          </Form.Item>
          <Form.Item
            label="Thời lượng (phút)"
            name="duration"
            rules={[{ required: true, message: 'Nhập thời lượng' }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            label="Nội dung"
            name="content"
            rules={[{ required: true, message: 'Nhập nội dung' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Ghi chú" name="note">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
