import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Space, Table, Modal, message, Select, Card } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { QuestionService, SubjectService, KnowledgeBlockService } from '@/models/questionbank/services';
import { Question, Subject, KnowledgeBlock } from '@/models/questionbank/types';

const QuestionTab: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [blocks, setBlocks] = useState<KnowledgeBlock[]>([]);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filters, setFilters] = useState({ subjectId: '', difficulty: '', knowledgeBlockId: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allQuestions = QuestionService.getAll();
    setQuestions(allQuestions);
    setSubjects(SubjectService.getAll());
    setBlocks(KnowledgeBlockService.getAll());
  };

  const handleSearch = () => {
    let filtered = QuestionService.getAll();
    if (filters.subjectId) filtered = filtered.filter(q => q.subjectId === filters.subjectId);
    if (filters.difficulty) filtered = filtered.filter(q => q.difficulty === filters.difficulty);
    if (filters.knowledgeBlockId) filtered = filtered.filter(q => q.knowledgeBlockId === filters.knowledgeBlockId);
    setQuestions(filtered);
  };

  const handleAdd = async (values: any) => {
    if (editingId) {
      QuestionService.update(editingId, values);
      message.success('Cập nhật thành công!');
    } else {
      QuestionService.add(values);
      message.success('Thêm thành công!');
    }
    form.resetFields();
    setIsModalVisible(false);
    setEditingId(null);
    loadData();
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xóa câu hỏi',
      content: 'Bạn chắc chắn muốn xóa?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: () => {
        QuestionService.delete(id);
        message.success('Xóa thành công!');
        loadData();
      },
    });
  };

  const handleEdit = (record: Question) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'Mã câu hỏi',
      dataIndex: 'code',
      key: 'code',
      width: 100,
    },
    {
      title: 'Môn học',
      dataIndex: 'subjectId',
      key: 'subjectId',
      render: (id: string) => subjects.find(s => s.id === id)?.name || id,
    },
    {
      title: 'Khối kiến thức',
      dataIndex: 'knowledgeBlockId',
      key: 'knowledgeBlockId',
      render: (id: string) => blocks.find(b => b.id === id)?.name || id,
    },
    {
      title: 'Độ khó',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 100,
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (text: string) => text.substring(0, 50) + (text.length > 50 ? '...' : ''),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (_: any, record: Question) => (
        <Space size="small">
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
      <Card style={{ marginBottom: '20px' }}>
        <Form layout="horizontal" style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <Form.Item label="Môn học" style={{ marginBottom: 0, flex: 1 }}>
            <Select
              placeholder="Chọn môn học"
              allowClear
              value={filters.subjectId || undefined}
              onChange={(v) => setFilters({ ...filters, subjectId: v || '' })}
              options={subjects.map(s => ({ label: s.name, value: s.id }))}
            />
          </Form.Item>
          <Form.Item label="Độ khó" style={{ marginBottom: 0, flex: 1 }}>
            <Select
              placeholder="Chọn độ khó"
              allowClear
              value={filters.difficulty || undefined}
              onChange={(v) => setFilters({ ...filters, difficulty: v || '' })}
              options={['Dễ', 'Trung bình', 'Khó', 'Rất khó'].map(d => ({ label: d, value: d }))}
            />
          </Form.Item>
          <Form.Item label="Khối kiến thức" style={{ marginBottom: 0, flex: 1 }}>
            <Select
              placeholder="Chọn khối kiến thức"
              allowClear
              value={filters.knowledgeBlockId || undefined}
              onChange={(v) => setFilters({ ...filters, knowledgeBlockId: v || '' })}
              options={blocks.map(b => ({ label: b.name, value: b.id }))}
            />
          </Form.Item>
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </Form>
      </Card>

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
        Thêm Câu Hỏi
      </Button>

      <Table
        columns={columns}
        dataSource={questions}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title={editingId ? 'Sửa Câu Hỏi' : 'Thêm Câu Hỏi'}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingId(null);
        }}
        footer={null}
        width={700}
      >
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item
            label="Mã câu hỏi"
            name="code"
            rules={[{ required: true, message: 'Vui lòng nhập mã!' }]}
          >
            <Input placeholder="VD: Q001" />
          </Form.Item>
          <Form.Item
            label="Môn học"
            name="subjectId"
            rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
          >
            <Select
              placeholder="Chọn môn học"
              options={subjects.map(s => ({ label: s.name, value: s.id }))}
            />
          </Form.Item>
          <Form.Item
            label="Khối kiến thức"
            name="knowledgeBlockId"
            rules={[{ required: true, message: 'Vui lòng chọn khối kiến thức!' }]}
          >
            <Select
              placeholder="Chọn khối kiến thức"
              options={blocks.map(b => ({ label: b.name, value: b.id }))}
            />
          </Form.Item>
          <Form.Item
            label="Nội dung câu hỏi"
            name="content"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="Độ khó"
            name="difficulty"
            rules={[{ required: true, message: 'Vui lòng chọn độ khó!' }]}
          >
            <Select
              placeholder="Chọn độ khó"
              options={[
                { label: 'Dễ', value: 'Dễ' },
                { label: 'Trung bình', value: 'Trung bình' },
                { label: 'Khó', value: 'Khó' },
                { label: 'Rất khó', value: 'Rất khó' },
              ]}
            />
          </Form.Item>
          <Form.Item label="Đáp án" name="answer">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            {editingId ? 'Cập nhật' : 'Thêm'}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default QuestionTab;
