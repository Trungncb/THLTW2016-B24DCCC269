import React, { useState } from 'react';
import { Tabs, Layout } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Dashboard } from './components/Dashboard';
import { ProductManagement } from './components/ProductManagement';
import { OrderManagement } from './components/OrderManagement';

const { Header, Content } = Layout;

const OrderProductPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0, lineHeight: '64px', fontSize: '20px', fontWeight: 'bold' }}>
          Hệ thống Quản lý Đơn hàng và Sản phẩm
        </h1>
      </Header>

      <Content style={{ background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ padding: '0' }}>
          <Tabs.TabPane
            tab={
              <>
                <DashboardOutlined /> Dashboard
              </>
            }
            key="dashboard"
          >
            <Dashboard />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <>
                <ShoppingOutlined /> Quản lý Sản phẩm
              </>
            }
            key="products"
          >
            <ProductManagement />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <>
                <ShoppingCartOutlined /> Quản lý Đơn hàng
              </>
            }
            key="orders"
          >
            <OrderManagement />
          </Tabs.TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default OrderProductPage;
