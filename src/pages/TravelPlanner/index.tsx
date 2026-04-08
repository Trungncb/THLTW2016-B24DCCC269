import React, { useState } from 'react';
import { Tabs } from 'antd';
import {
  ShoppingOutlined,
  CalendarOutlined,
  DollarOutlined,
  ControlOutlined,
} from '@ant-design/icons';
import Destinations from './Destinations';
import Itinerary from './Itinerary';
import Budget from './Budget';
import Admin from './Admin';
import styles from './index.less';

const TravelPlanner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('destinations');
  const items = [
    {
      key: 'destinations',
      tab: (
        <span>
          <ShoppingOutlined />
          Khám phá
        </span>
      ),
    },
    {
      key: 'itinerary',
      tab: (
        <span>
          <CalendarOutlined />
          Lịch trình
        </span>
      ),
    },
    {
      key: 'budget',
      tab: (
        <span>
          <DollarOutlined />
          Ngân sách
        </span>
      ),
    },
    {
      key: 'admin',
      tab: (
        <span>
          <ControlOutlined />
          Quản lý
        </span>
      ),
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'itinerary':
        return <Itinerary />;
      case 'budget':
        return <Budget />;
      case 'admin':
        return <Admin />;
      case 'destinations':
      default:
        return <Destinations />;
    }
  };

  return (
    <div className={styles.container}>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab={items[0].tab} key={items[0].key}>
          {renderContent()}
        </Tabs.TabPane>
        <Tabs.TabPane tab={items[1].tab} key={items[1].key}>
          {renderContent()}
        </Tabs.TabPane>
        <Tabs.TabPane tab={items[2].tab} key={items[2].key}>
          {renderContent()}
        </Tabs.TabPane>
        <Tabs.TabPane tab={items[3].tab} key={items[3].key}>
          {renderContent()}
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default TravelPlanner;
