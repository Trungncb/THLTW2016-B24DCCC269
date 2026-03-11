import React, { useState, useEffect } from 'react';
import { Tabs, Button, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import KnowledgeBlockTab from './KnowledgeBlockTab';
import SubjectTab from './SubjectTab';
import QuestionTab from './QuestionTab';
import ExamTab from './ExamTab';
import './style.less';

const QuestionBank: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="question-bank">
      <div style={{ marginBottom: '20px' }}>
        <h1>Quản lý Ngân hàng Câu hỏi</h1>
        <p>Hệ thống quản lý câu hỏi tự luận và tạo đề thi</p>
      </div>

      <Tabs
        defaultActiveKey="knowledge"
        items={[
          {
            key: 'knowledge',
            label: '📚 Khối Kiến Thức',
            children: <KnowledgeBlockTab key={refreshKey} onRefresh={handleRefresh} />,
          },
          {
            key: 'subject',
            label: '📖 Môn Học',
            children: <SubjectTab key={refreshKey} onRefresh={handleRefresh} />,
          },
          {
            key: 'question',
            label: '❓ Câu Hỏi',
            children: <QuestionTab key={refreshKey} onRefresh={handleRefresh} />,
          },
          {
            key: 'exam',
            label: '📝 Quản lý Đề Thi',
            children: <ExamTab key={refreshKey} onRefresh={handleRefresh} />,
          },
        ]}
      />
    </div>
  );
};

export default QuestionBank;
