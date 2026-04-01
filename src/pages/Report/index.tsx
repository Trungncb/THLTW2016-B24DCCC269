import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Empty,
} from 'antd';
import {
  TeamOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationOutlined,
} from '@ant-design/icons';
import * as ReportService from '@/services/Report';
import ColumnChart from '@/components/Chart/ColumnChart';
import styles from './index.less';

const Report: React.FC = () => {
  const [statisticsData, setStatisticsData] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartLoading, setChartLoading] = useState(false);

  // Fetch overall statistics
  const fetchStatistics = async () => {
    try {
      const response = await ReportService.getOverallStatistics();
      setStatisticsData(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  // Fetch chart data
  const fetchChartData = async () => {
    setChartLoading(true);
    try {
      const response = await ReportService.getRegistrationByClubChart();
      setChartData(response.data || []);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
    fetchChartData();
  }, []);

  const stats = statisticsData;

  // Transform chart data for ApexCharts ColumnChart
  // ColumnChart expects: xAxis: string[], yAxis: number[][], yLabel: string[]
  const xAxis = chartData?.map((item: any) => item.clubName) || [];
  const yAxis = [
    chartData?.map((item: any) => item.pending) || [],
    chartData?.map((item: any) => item.approved) || [],
    chartData?.map((item: any) => item.rejected) || [],
  ];
  const yLabel = ['Chờ duyệt', 'Đã duyệt', 'Từ chối'];

  return (
    <div>
      <div className={styles.container}>
        {/* Overall Statistics */}
        <Card className={styles.statisticsCard}>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={6}>
              <Statistic
                title="Tổng số câu lạc bộ"
                value={stats?.clubs?.totalClubs || 0}
                prefix={<TeamOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Statistic
                title="Đơn chờ duyệt"
                value={stats?.registrations?.totalPending || 0}
                prefix={<ExclamationOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Statistic
                title="Đơn đã duyệt"
                value={stats?.registrations?.totalApproved || 0}
                prefix={<CheckOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Statistic
                title="Đơn bị từ chối"
                value={stats?.registrations?.totalRejected || 0}
                prefix={<CloseOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Col>
          </Row>
        </Card>

        {/* Registration by Club Chart */}
        <Card
          title="Đơn đăng ký theo câu lạc bộ"
          className={styles.chartCard}
          loading={chartLoading}
        >
          {xAxis && xAxis.length > 0 ? (
            <ColumnChart
              xAxis={xAxis}
              yAxis={yAxis}
              yLabel={yLabel}
              height={400}
            />
          ) : (
            <Empty description="Không có dữ liệu" />
          )}
        </Card>
      </div>
    </div>
  );
};

export default Report;
