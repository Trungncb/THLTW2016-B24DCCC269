import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Space, Table, Modal, message, Select, Card, Row, Col, InputNumber, Divider } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined, MinusOutlined } from '@ant-design/icons';
import { ExamService, ExamStructureService, SubjectService, QuestionService, KnowledgeBlockService } from '@/models/questionbank/services';
import { Exam, ExamStructure, Subject, KnowledgeBlock } from '@/models/questionbank/types';

interface ExamTabProps {
  onRefresh: () => void;
}

const ExamTab: React.FC<ExamTabProps> = ({ onRefresh }) => {
  const [activeTab, setActiveTab] = useState('structure'); // 'structure' or 'exam'
  const [exams, setExams] = useState<Exam[]>([]);
  const [structures, setStructures] = useState<ExamStructure[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [blocks, setBlocks] = useState<KnowledgeBlock[]>([]);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [requirements, setRequirements] = useState<{ difficulty: string; count: number; knowledgeBlocks: string[] }[]>([
    { difficulty: 'Dễ', count: 2, knowledgeBlocks: [] },
  ]);
  const [selectedStructure, setSelectedStructure] = useState<string>('');
  const [viewingExam, setViewingExam] = useState<Exam | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setExams(ExamService.getAll());
    setStructures(ExamStructureService.getAll());
    setSubjects(SubjectService.getAll());
    setBlocks(KnowledgeBlockService.getAll());
  };

  // ========== CẤU TRÚC ĐỀ THI ==========
  const handleAddStructure = async (values: any) => {
    if (requirements.length === 0) {
      message.error('Vui lòng thêm ít nhất một yêu cầu!');
      return;
    }

    if (editingId) {
      // Cập nhật (giả lập - không có API update cho structure)
      message.success('Cập nhật thành công!');
    } else {
      ExamStructureService.add({
        ...values,
        requirements,
      });
      message.success('Tạo cấu trúc đề thi thành công!');
    }
    form.resetFields();
    setIsModalVisible(false);
    setEditingId(null);
    setRequirements([{ difficulty: 'Dễ', count: 2, knowledgeBlocks: [] }]);
    loadData();
  };

  const handleDeleteStructure = (id: string) => {
    Modal.confirm({
      title: 'Xóa cấu trúc đề thi',
      content: 'Bạn chắc chắn muốn xóa?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: () => {
        ExamStructureService.delete(id);
        message.success('Xóa thành công!');
        loadData();
      },
    });
  };

  // ========== ĐỀ THI ==========
  const handleCreateExam = () => {
    if (!selectedStructure) {
      message.error('Vui lòng chọn cấu trúc đề thi!');
      return;
    }

    const { exam, error } = ExamService.createFromStructure(selectedStructure);
    if (error) {
      message.error(error);
    } else {
      message.success('Tạo đề thi thành công!');
      setSelectedStructure('');
      loadData();
    }
  };

  const handleDeleteExam = (id: string) => {
    Modal.confirm({
      title: 'Xóa đề thi',
      content: 'Bạn chắc chắn muốn xóa?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: () => {
        ExamService.delete(id);
        message.success('Xóa thành công!');
        loadData();
      },
    });
  };

  // ========== RENDER STRUCTURE TABLE ==========
  const structureColumns = [
    {
      title: 'Tên cấu trúc',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Môn học',
      dataIndex: 'subjectId',
      key: 'subjectId',
      render: (id) => subjects.find(s => s.id === id)?.name || id,
    },
    {
      title: 'Số lượng yêu cầu',
      dataIndex: 'requirements',
      key: 'requirements',
      render: (reqs) => reqs.length,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteStructure(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  // ========== RENDER EXAM TABLE ==========
  const examColumns = [
    {
      title: 'ID Đề thi',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id) => id.substring(0, 8) + '...',
    },
    {
      title: 'Môn học',
      dataIndex: 'subjectId',
      key: 'subjectId',
      render: (id) => subjects.find(s => s.id === id)?.name || id,
    },
    {
      title: 'Số câu hỏi',
      dataIndex: 'questions',
      key: 'questions',
      render: (questions) => questions.length,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => setViewingExam(record)}
          >
            Xem
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteExam(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const containerStyle = activeTab === 'structure' ? {} : { display: 'none' };

  return (
    <div>
      <Card style={{ marginBottom: '20px' }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Button
              type={activeTab === 'structure' ? 'primary' : 'default'}
              onClick={() => setActiveTab('structure')}
              style={{ marginRight: '10px' }}
            >
              📋 Cấu Trúc Đề Thi
            </Button>
            <Button
              type={activeTab === 'exam' ? 'primary' : 'default'}
              onClick={() => setActiveTab('exam')}
            >
              📝 Quản Lý Đề Thi
            </Button>
          </Col>
        </Row>
      </Card>

      {/* ========== TAB CẤU TRÚC ĐỀ THI ========== */}
      <div style={containerStyle}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingId(null);
            form.resetFields();
            setRequirements([{ difficulty: 'Dễ', count: 2, knowledgeBlocks: [] }]);
            setIsModalVisible(true);
          }}
          style={{ marginBottom: '20px' }}
        >
          Tạo Cấu Trúc Đề Thi
        </Button>

        <Table
          columns={structureColumns}
          dataSource={structures}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />

        <Modal
          title="Tạo Cấu Trúc Đề Thi"
          visible={isModalVisible && activeTab === 'structure'}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={800}
        >
          <Form form={form} onFinish={handleAddStructure} layout="vertical">
            <Form.Item
              label="Tên cấu trúc"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
            >
              <Input placeholder="VD: Đề thi môn CSDL năm 2024" />
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

            <Divider>Yêu cầu câu hỏi</Divider>

            {requirements.map((req, idx) => (
              <Card key={idx} style={{ marginBottom: '15px' }}>
                <Row gutter={16}>
                  <Col span={8}>
                    <label>Độ khó</label>
                    <Select
                      value={req.difficulty}
                      onChange={(v) => {
                        const newReqs = [...requirements];
                        newReqs[idx].difficulty = v;
                        setRequirements(newReqs);
                      }}
                      options={['Dễ', 'Trung bình', 'Khó', 'Rất khó'].map(d => ({ label: d, value: d }))}
                    />
                  </Col>
                  <Col span={8}>
                    <label>Số lượng</label>
                    <InputNumber
                      min={1}
                      value={req.count}
                      onChange={(v) => {
                        const newReqs = [...requirements];
                        newReqs[idx].count = v || 1;
                        setRequirements(newReqs);
                      }}
                    />
                  </Col>
                  <Col span={8}>
                    <Button
                      danger
                      icon={<MinusOutlined />}
                      onClick={() => {
                        setRequirements(requirements.filter((_, i) => i !== idx));
                      }}
                      block
                    >
                      Xóa
                    </Button>
                  </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: '10px' }}>
                  <Col span={24}>
                    <label>Khối kiến thức (tùy chọn)</label>
                    <Select
                      mode="multiple"
                      placeholder="Chọn khối kiến thức (để trống = tất cả)"
                      value={req.knowledgeBlocks}
                      onChange={(v) => {
                        const newReqs = [...requirements];
                        newReqs[idx].knowledgeBlocks = v;
                        setRequirements(newReqs);
                      }}
                      options={blocks.map(b => ({ label: b.name, value: b.id }))}
                    />
                  </Col>
                </Row>
              </Card>
            ))}

            <Button
              type="dashed"
              block
              icon={<PlusOutlined />}
              onClick={() => {
                setRequirements([...requirements, { difficulty: 'Dễ', count: 1, knowledgeBlocks: [] }]);
              }}
              style={{ marginBottom: '15px' }}
            >
              Thêm Yêu Cầu
            </Button>

            <Button type="primary" htmlType="submit" block>
              Tạo Cấu Trúc
            </Button>
          </Form>
        </Modal>
      </div>

      {/* ========== TAB QUẢN LÝ ĐỀ THI ========== */}
      <div style={activeTab === 'exam' ? {} : { display: 'none' }}>
        <Card style={{ marginBottom: '20px' }}>
          <Row gutter={16} align="middle">
            <Col flex={1}>
              <Select
                placeholder="Chọn cấu trúc đề thi"
                value={selectedStructure}
                onChange={setSelectedStructure}
                options={structures.map(s => ({
                  label: s.name,
                  value: s.id,
                }))}
              />
            </Col>
            <Col>
              <Button type="primary" onClick={handleCreateExam}>
                Tạo Đề Thi
              </Button>
            </Col>
          </Row>
        </Card>

        <Table
          columns={examColumns}
          dataSource={exams}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* ========== MODAL XEM ĐỀ THI ========== */}
      <Modal
        title={`Đề thi (${viewingExam?.id.substring(0, 8)}...)`}
        visible={!!viewingExam}
        onCancel={() => setViewingExam(null)}
        footer={null}
        width={900}
      >
        {viewingExam && (
          <div>
            <p><strong>Môn học:</strong> {subjects.find(s => s.id === viewingExam.subjectId)?.name}</p>
            <p><strong>Ngày tạo:</strong> {new Date(viewingExam.createdAt || '').toLocaleDateString('vi-VN')}</p>
            <Divider>Danh Sách Câu Hỏi</Divider>
            {viewingExam.questions.map((q, idx) => (
              <Card key={idx} style={{ marginBottom: '15px' }}>
                <p><strong>Câu {idx + 1}: {q.code}</strong></p>
                <p><strong>Nội dung:</strong> {q.content}</p>
                <p><strong>Độ khó:</strong> {q.difficulty}</p>
                <p><strong>Khối kiến thức:</strong> {blocks.find(b => b.id === q.knowledgeBlockId)?.name}</p>
                {q.answer && (
                  <p><strong>Đáp án:</strong> {q.answer}</p>
                )}
              </Card>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ExamTab;
