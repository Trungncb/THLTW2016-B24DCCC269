import React from 'react';
import { Card, Rate, Tag, Button, Space, Image } from 'antd';
import { HeartOutlined, HeartFilled, ShoppingCartOutlined } from '@ant-design/icons';
import styles from './DestinationCard.less';
import type { Destination } from '@/models/travelplanner';

interface DestinationCardProps {
  destination: Destination;
  onAddToItinerary?: (destination: Destination) => void;
  onFavorite?: (destination: Destination, isFavorite: boolean) => void;
  isFavorite?: boolean;
}

const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onAddToItinerary,
  onFavorite,
  isFavorite = false,
}) => {
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      beach: 'blue',
      mountain: 'green',
      city: 'orange',
    };
    return colors[type] || 'default';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      beach: 'Bãi biển',
      mountain: 'Núi',
      city: 'Thành phố',
    };
    return labels[type] || type;
  };

  return (
    <Card
      hoverable
      cover={<Image alt={destination.name} src={destination.image} height={200} />}
      className={styles.card}
      actions={[
        <Button
          key="favorite"
          type="text"
          icon={isFavorite ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
          onClick={() => onFavorite?.(destination, !isFavorite)}
        />,
        <Button
          key="add-to-itinerary"
          type="primary"
          shape="circle"
          icon={<ShoppingCartOutlined />}
          onClick={() => onAddToItinerary?.(destination)}
        />,
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <h3 style={{ margin: 0 }}>{destination.name}</h3>
        <div>
          <Tag color={getTypeColor(destination.type)}>{getTypeLabel(destination.type)}</Tag>
          <Tag>{destination.location}</Tag>
        </div>
        <div>
          <Rate disabled value={destination.rating} />
          <span style={{ marginLeft: 8 }}>({destination.rating})</span>
        </div>
        <p style={{ margin: 0, color: '#666' }}>{destination.description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 16, fontWeight: 'bold', color: '#1890ff' }}>
            {destination.price.toLocaleString()} {destination.currency}
          </span>
          <span style={{ fontSize: 12, color: '#999' }}>~{destination.estimatedDays} ngày</span>
        </div>
      </Space>
    </Card>
  );
};

export default DestinationCard;
