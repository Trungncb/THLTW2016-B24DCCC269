import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Space, Table, Modal, message, Select, Card, Row, Col, InputNumber, Divider, Tabs as AntTabs, Empty } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined, MinusOutlined } from '@ant-design/icons';
import { ExamService, ExamStructureService, SubjectService, KnowledgeBlockService } from '@/models/questionbank/services';
import { Exam, ExamStructure, Subject, KnowledgeBlock } from '@/models/questionbank/types';

const ExamTab: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [structures, setStructures] = useState<ExamStructure[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [blocks, setBlocks] = useState<KnowledgeBlock[]>([]);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [requirements, setRequirements] = useState<{ difficulty: string; count: number; knowledgeBlocks: string[] }[]>([
    { difficulty: 'Dễ', count: 2, knowledgeBlocks: [] },
  ]);
  const [selectedStructure, setSelectedStructure] = useState<string>('');
  const [viewingExam, setViewingExam] = useState<Exam | null>(null);
  const [activeTab, setActiveTab] = useState('structure');

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

    ExamStructureService.add({
      ...values,
      requirements,
    });
    message.success('Tạo cấu trúc đề thi thành công!');
    form.resetFields();
    setIsModalVisible(false);
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

    const { error } = ExamService.createFromStructure(selectedStructure);
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
      render: (id: string) => subjects.find(s => s.id === id)?.name || id,
    },
    {
      title: 'Số lượng yêu cầu',
      dataIndex: 'requirements',
      key: 'requirements',
      render: (reqs: any[]) => reqs.length,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      render: (_: any, record: ExamStructure) => (
        <Button
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteStructure(record.id)}
        >
          Xóa
        </Button>
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
      render: (id: string) => id.substring(0, 8) + '...',
    },
    {
      title: 'Môn học',
      dataIndex: 'subjectId',
      key: 'subjectId',
      render: (id: string) => subjects.find(s => s.id === id)?.name || id,
    },
    {
      title: 'Số câu hỏi',
      dataIndex: 'questions',
      key: 'questions',
      render: (questions: any[]) => questions.length,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: any) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (_: any, record: Exam) => (
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

  return (
    <div>
      <AntTabs activeKey={activeTab} onChange={setActiveTab}>
        <AntTabs.TabPane tab="📋 Cấu Trúc Đề Thi" key="structure">
          <div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                form.resetFields();
                setRequirements([{ difficulty: 'Dễ', count: 2, knowledgeBlocks: [] }]);
                setIsModalVisible(true);
              }}
              style={{ marginBottom: '20px' }}
              size="large"
            >
              Tạo Cấu Trúc Đề Thi
            </Button>

            {structures.length === 0 ? (
              <Empty description="Chưa có cấu trúc đề thi" style={{ marginTop: '50px' }} />
            ) : (
              <Table
                columns={structureColumns}
                dataSource={structures}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            )}
          </div>
        </AntTabs.TabPane>
        <AntTabs.TabPane tab="📝 Quản Lý Đề Thi" key="exam">
              <div>
                <Card style={{ marginBottom: '20px' }}>
                  <Row gutter={16} align="middle">
                    <Col flex="auto">
                      <Select
                        placeholder="Chọn cấu trúc đề thi"
                        value={selectedStructure}
                        onChange={setSelectedStructure}
                        size="large"
                        options={structures.map(s => ({
                          label: `${s.name} (${subjects.find(sb => sb.id === s.subjectId)?.name || 'N/A'})`,
                          value: s.id,
                        }))}
                      />
                    </Col>
                    <Col>
                      <Button type="primary" onClick={handleCreateExam} size="large">
                        Tạo Đề Thi
                      </Button>
                    </Col>
                  </Row>
                </Card>

                {exams.length === 0 ? (
                  <Empty description="Chưa có đề thi nào" />
                ) : (
                  <Table
                    columns={examColumns}
                    dataSource={exams}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 1000 }}
                  />
                )}
            </div>
        </AntTabs.TabPane>
      </AntTabs>

      {/* MODAL TẠO CẤU TRÚC */}
      <Modal
        title="Tạo Cấu Trúc Đề Thi"
        visible={isModalVisible}
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
            <Input placeholder="VD: Đề thi CSDL 2024" size="large" />
          </Form.Item>
          <Form.Item
            label="Môn học"
            name="subjectId"
            rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
          >
            <Select
              placeholder="Chọn môn học"
              size="large"
              options={subjects.map(s => ({ label: `${s.code} - ${s.name}`, value: s.id }))}
            />
          </Form.Item>

          <Divider>Yêu cầu câu hỏi</Divider>

          {requirements.map((req, idx) => (
            <Card key={idx} style={{ marginBottom: '15px' }}>
              <Row gutter={16}>
                <Col span={8}>
                  <label style={{ fontWeight: 500 }}>Độ khó</label>
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
                  <label style={{ fontWeight: 500 }}>Số lượng</label>
                  <InputNumber
                    min={1}
                    value={req.count}
                    onChange={(v) => {
                      const newReqs = [...requirements];
                      newReqs[idx].count = v || 1;
                      setRequirements(newReqs);
                    }}
                    style={{ width: '100%' }}
                    size="large"
                  />
                </Col>
                <Col span={8}>
                  <label>&nbsp;</label>
                  <Button
                    danger
                    icon={<MinusOutlined />}
                    onClick={() => {
                      if (requirements.length > 1) {
                        setRequirements(requirements.filter((_, i) => i !== idx));
                      } else {
                        message.error('Phải có ít nhất 1 yêu cầu!');
                      }
                    }}
                    block
                  >
                    Xóa
                  </Button>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: '10px' }}>
                <Col span={24}>
                  <label style={{ fontWeight: 500 }}>Khối kiến thức (tùy chọn)</label>
                  <Select
                    mode="multiple"
                    placeholder="để trống = tất cả khối kiến thức"
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
            style={{ marginBottom: '20px' }}
          >
            + Thêm Yêu Cầu
          </Button>

          <Button type="primary" htmlType="submit" block size="large">
            Tạo Cấu Trúc
          </Button>
        </Form>
      </Modal>

      {/* MODAL XEM ĐỀ THI */}
      <Modal
        title={`Xem Đề Thi (${viewingExam?.id.substring(0, 8)}...)`}
        visible={!!viewingExam}
        onCancel={() => setViewingExam(null)}
        footer={null}
        width={900}
      >
        {viewingExam && (
          <div>
            <Card style={{ marginBottom: '15px' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <strong>Môn học:</strong> {subjects.find(s => s.id === viewingExam.subjectId)?.name}
                </Col>
                <Col span={12}>
                  <strong>Ngày tạo:</strong> {new Date(viewingExam.createdAt || '').toLocaleDateString('vi-VN')}
                </Col>
                <Col span={24} style={{ marginTop: '10px' }}>
                  <strong>Tổng số câu:</strong> {viewingExam.questions.length}
                </Col>
              </Row>
            </Card>

            <Divider>Danh Sách Câu Hỏi</Divider>

            {viewingExam.questions.map((q, idx) => (
              <Card key={idx} style={{ marginBottom: '15px' }}>
                <p style={{ marginBottom: '5px' }}>
                  <strong style={{ fontSize: '14px', color: '#1890ff' }}>Câu {idx + 1}: {q.code}</strong>
                </p>
                <p style={{ marginBottom: '5px' }}><strong>📝 Nội dung:</strong> {q.content}</p>
                <Row gutter={16} style={{ marginTop: '10px' }}>
                  <Col span={12}>
                    <span><strong>⚡ Độ khó:</strong> {q.difficulty}</span>
                  </Col>
                  <Col span={12}>
                    <span><strong>📚 Khối kiến thức:</strong> {blocks.find(b => b.id === q.knowledgeBlockId)?.name}</span>
                  </Col>
                </Row>
                {q.answer && (
                  <p style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    <strong>✓ Đáp án:</strong> {q.answer}
                  </p>
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
