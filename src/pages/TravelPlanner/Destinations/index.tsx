import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Select,
  Input,
  Button,
  Space,
  Rate,
  Empty,
  Spin,
  message,
  Slider,
} from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import DestinationCard from '../components/DestinationCard';
import { destinationService } from '@/services/TravelPlanner';
import type { Destination, DestinationFilter } from '@/models/travelplanner';
import styles from './Destinations.less';

const Destinations: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<DestinationFilter>({
    type: null,
    priceRange: [0, 5000000],
    minRating: 0,
    searchText: '',
  });
  const [sortBy, setSortBy] = useState<string>('name');

  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });

  const loadDestinations = async () => {
    try {
      setLoading(true);
      const data = await destinationService.getDestinations();
      setDestinations(data);
    } catch (error) {
      message.error('Không thể tải danh sách điểm đến');
    } finally {
      setLoading(false);
    }
  };

  // Load destinations on mount
  useEffect(() => {
    loadDestinations();
  }, []);

  // Filter and sort destinations when filters or destinations change
  useEffect(() => {
    let result = destinations;

    // Apply filters
    if (filters.type) {
      result = result.filter((d) => d.type === filters.type);
    }

    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(searchLower) ||
          d.location.toLowerCase().includes(searchLower) ||
          d.description.toLowerCase().includes(searchLower),
      );
    }

    if (filters.priceRange) {
      result = result.filter(
        (d) => d.price >= filters.priceRange![0] && d.price <= filters.priceRange![1],
      );
    }

    if (filters.minRating && filters.minRating > 0) {
      const minRating = filters.minRating;
      result = result.filter((d) => d.rating >= minRating);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
      default:
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredDestinations(result);
  }, [destinations, filters, sortBy]);

  const handleFilterChange = (newFilters: Partial<DestinationFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      type: null,
      priceRange: [0, 5000000],
      minRating: 0,
      searchText: '',
    });
    setSortBy('name');
  };

  const handleAddToItinerary = (destination: Destination) => {
    message.success(`Đã thêm ${destination.name} vào lịch trình`);
    // TODO: Integrate with itinerary creation
  };

  const handleFavorite = (destination: Destination, isFavorite: boolean) => {
    const newFavorites = new Set(favorites);
    if (isFavorite) {
      newFavorites.add(destination.id);
    } else {
      newFavorites.delete(destination.id);
    }
    setFavorites(newFavorites);
  };

  const colSpan = isMobile ? 24 : isTablet ? 12 : 8;

  return (
    <div className={styles.container}>
      <Card title="Khám phá điểm đến" className={styles.filterCard}>
        <Space direction={isMobile ? 'vertical' : 'horizontal'} style={{ width: '100%' }} wrap>
          <Input
            placeholder="Tìm kiếm điểm đến..."
            prefix={<SearchOutlined />}
            style={{ width: isMobile ? '100%' : 200 }}
            value={filters.searchText}
            onChange={(e) => handleFilterChange({ searchText: e.target.value })}
          />

          <Select
            style={{ width: isMobile ? '100%' : 120 }}
            placeholder="Loại hình"
            allowClear
            value={filters.type}
            onChange={(value) => handleFilterChange({ type: value || null })}
            options={[
              { label: 'Bãi biển', value: 'beach' },
              { label: 'Núi', value: 'mountain' },
              { label: 'Thành phố', value: 'city' },
            ]}
          />

          <div style={{ width: isMobile ? '100%' : 'auto' }}>
            <label>Khoảng giá: </label>
            <Slider
              range
              min={0}
              max={5000000}
              step={100000}
              value={filters.priceRange}
              onChange={(value) => handleFilterChange({ priceRange: value as [number, number] })}
              style={{ width: isMobile ? '100%' : 200 }}
              marks={{
                0: '0',
                5000000: '5M',
              }}
            />
          </div>

          <div>
            <label>Đánh giá từ: </label>
            <Rate
              value={filters.minRating}
              onChange={(value) => handleFilterChange({ minRating: value })}
            />
          </div>

          <Select
            style={{ width: isMobile ? '100%' : 120 }}
            placeholder="Sắp xếp"
            value={sortBy}
            onChange={setSortBy}
            options={[
              { label: 'Tên A-Z', value: 'name' },
              { label: 'Giá tăng dần', value: 'price-asc' },
              { label: 'Giá giảm dần', value: 'price-desc' },
              { label: 'Đánh giá cao nhất', value: 'rating' },
            ]}
          />

          <Button onClick={handleClearFilters} icon={<ClearOutlined />}>
            Xóa bộ lọc
          </Button>
        </Space>
      </Card>

      <div className={styles.resultInfo}>
        <p>Tìm thấy {filteredDestinations.length} điểm đến</p>
      </div>

      <Spin spinning={loading}>
        {filteredDestinations.length > 0 ? (
          <Row gutter={[16, 16]}>
            {filteredDestinations.map((destination) => (
              <Col key={destination.id} xs={24} sm={12} md={colSpan} lg={colSpan}>
                <DestinationCard
                  destination={destination}
                  onAddToItinerary={handleAddToItinerary}
                  onFavorite={handleFavorite}
                  isFavorite={favorites.has(destination.id)}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description="Không tìm thấy điểm đến nào" />
        )}
      </Spin>
    </div>
  );
};

export default Destinations;
