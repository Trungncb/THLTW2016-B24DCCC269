import React, { useState, useMemo } from 'react';
import { Table, Button, Modal, Form, InputNumber, Select, message, Space, DatePicker } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useStudy, Goal } from '@/models/study';

export const GoalManager: React.FC = () => {
  const { goals, subjects, addGoal, updateGoal, deleteGoal } = useStudy();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [form] = Form.useForm();

  const columns: ColumnsType<Goal> = [
    {
      title: 'Tháng',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: 'Môn (blank = tổng)',
      dataIndex: 'subjectId',
      key: 'subjectId',
      render: (id) => (id ? subjects.find(s => s.id === id)?.name : 'Tất cả'),
    },
    {
      title: 'Mục tiêu (phút)',
      dataIndex: 'targetMinutes',
      key: 'targetMinutes',
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
                title: 'Xóa mục tiêu',
                onOk: () => {
                  deleteGoal(record.id);
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
      const payload: Omit<Goal, 'id'> = {
        month: values.month.format('YYYY-MM'),
        subjectId: values.subjectId,
        targetMinutes: values.targetMinutes,
      };
      if (editing) {
        updateGoal(editing.id, payload);
        message.success('Cập nhật thành công');
      } else {
        addGoal(payload);
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
        Thiết lập mục tiêu
      </Button>
      <Table columns={columns} dataSource={goals} rowKey="id" bordered />

      <Modal
        title={editing ? 'Sửa mục tiêu' : 'Thêm mục tiêu'}
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
            label="Tháng"
            name="month"
            rules={[{ required: true, message: 'Chọn tháng' }]}
          >
            <DatePicker picker="month" />
          </Form.Item>
          <Form.Item label="Môn học" name="subjectId">
            <Select allowClear options={subjects.map(s => ({ label: s.name, value: s.id }))} />
          </Form.Item>
          <Form.Item
            label="Mục tiêu (phút)"
            name="targetMinutes"
            rules={[{ required: true, message: 'Nhập mục tiêu' }]}
          >
            <InputNumber min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
