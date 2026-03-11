import React, { useState } from 'react';
import { Tabs, Card } from 'antd';
import KnowledgeBlockTab from './components/KnowledgeBlockTab';
import SubjectTab from './components/SubjectTab';
import QuestionTab from './components/QuestionTab';
import ExamTab from './components/ExamTab';

const QuestionBank: React.FC = () => {
  const [activeTab, setActiveTab] = useState('blocks');

  return (
    <div style={{ padding: '20px' }}>
      <Card 
        style={{ 
          marginBottom: '20px', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white', 
          border: 'none' 
        }}
      >
        <h1 style={{ color: 'white', margin: 0, fontSize: '28px' }}>📚 Ngân hàng Câu hỏi Tự luận</h1>
        <p style={{ color: 'rgba(255,255,255,0.9)', marginTop: '5px' }}>
          Quản lý, tìm kiếm và tạo đề thi tự động
        </p>
      </Card>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="📚 Khối Kiến Thức" key="blocks">
          <KnowledgeBlockTab />
        </Tabs.TabPane>
        <Tabs.TabPane tab="📖 Môn Học" key="subjects">
          <SubjectTab />
        </Tabs.TabPane>
        <Tabs.TabPane tab="❓ Câu Hỏi" key="questions">
          <QuestionTab />
        </Tabs.TabPane>
        <Tabs.TabPane tab="📝 Đề Thi" key="exams">
          <ExamTab />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default QuestionBank;
