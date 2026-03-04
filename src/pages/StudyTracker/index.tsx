import React, { useState } from 'react';
import { Tabs, Layout } from 'antd';
import { BookOutlined, ScheduleOutlined, FlagOutlined } from '@ant-design/icons';
import { SubjectManager } from './components/SubjectManager';
import { SessionManager } from './components/SessionManager';
import { GoalManager } from './components/GoalManager';

const { Header, Content } = Layout;

const StudyTrackerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('subjects');

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0, lineHeight: '64px', fontSize: '20px', fontWeight: 'bold' }}>
          Quản lý tiến độ học tập
        </h1>
      </Header>
      <Content style={{ background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ padding: 0 }}>
          <Tabs.TabPane
            tab={<><BookOutlined /> Môn học</>}
            key="subjects"
          >
            <SubjectManager />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={<><ScheduleOutlined /> Buổi học</>}
            key="sessions"
          >
            <SessionManager />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={<><FlagOutlined /> Mục tiêu</>}
            key="goals"
          >
            <GoalManager />
          </Tabs.TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default StudyTrackerPage;
