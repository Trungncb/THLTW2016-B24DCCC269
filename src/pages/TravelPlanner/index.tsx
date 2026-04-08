import React from 'react';
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
  const items = [
    {
      key: 'destinations',
      label: (
        <span>
          <ShoppingOutlined />
          Khám phá
        </span>
      ),
      children: <Destinations />,
    },
    {
      key: 'itinerary',
      label: (
        <span>
          <CalendarOutlined />
          Lịch trình
        </span>
      ),
      children: <Itinerary />,
    },
    {
      key: 'budget',
      label: (
        <span>
          <DollarOutlined />
          Ngân sách
        </span>
      ),
      children: <Budget />,
    },
    {
      key: 'admin',
      label: (
        <span>
          <ControlOutlined />
          Quản lý
        </span>
      ),
      children: <Admin />,
    },
  ];

  return (
    <div className={styles.container}>
      <Tabs defaultActiveKey="destinations" items={items} />
    </div>
  );
};

export default TravelPlanner;
