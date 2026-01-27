import { useState, useCallback, useEffect } from 'react';

export interface OrderProduct {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  products: OrderProduct[];
  totalAmount: number;
  status: 'Chờ xử lý' | 'Đang giao' | 'Hoàn thành' | 'Đã hủy';
  createdAt: string;
}

const INITIAL_ORDERS: Order[] = [
  {
    id: 'DH001',
    customerName: 'Nguyễn Văn A',
    phone: '0912345678',
    address: '123 Nguyễn Huệ, Q1, TP.HCM',
    products: [
      { productId: 1, productName: 'Laptop Dell XPS 13', quantity: 1, price: 25000000 }
    ],
    totalAmount: 25000000,
    status: 'Chờ xử lý',
    createdAt: '2024-01-15',
  }
];

const STORAGE_KEY = 'orders';

export const useOrder = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Load từ localStorage khi component mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setOrders(JSON.parse(stored));
    } else {
      setOrders(INITIAL_ORDERS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
    }
  }, []);

  // Save vào localStorage mỗi khi orders thay đổi
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    }
  }, [orders]);

  const generateOrderId = useCallback(() => {
    const maxId = Math.max(
      ...orders.map(o => parseInt(o.id.replace('DH', ''), 10)),
      0
    );
    return `DH${String(maxId + 1).padStart(3, '0')}`;
  }, [orders]);

  const addOrder = useCallback((order: Omit<Order, 'id'>) => {
    const newOrder: Order = {
      ...order,
      id: generateOrderId(),
    };
    setOrders([...orders, newOrder]);
    return newOrder;
  }, [orders, generateOrderId]);

  const updateOrder = useCallback((id: string, updates: Partial<Order>) => {
    setOrders(orders.map(o => (o.id === id ? { ...o, ...updates } : o)));
  }, [orders]);

  const updateOrderStatus = useCallback((id: string, status: Order['status']) => {
    setOrders(orders.map(o => (o.id === id ? { ...o, status } : o)));
  }, [orders]);

  const deleteOrder = useCallback((id: string) => {
    setOrders(orders.filter(o => o.id !== id));
  }, [orders]);

  const getOrderById = useCallback((id: string) => {
    return orders.find(o => o.id === id);
  }, [orders]);

  const getOrdersByStatus = useCallback((status: Order['status']) => {
    return orders.filter(o => o.status === status);
  }, [orders]);

  const getOrderStats = useCallback(() => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'Chờ xử lý').length,
      shipping: orders.filter(o => o.status === 'Đang giao').length,
      completed: orders.filter(o => o.status === 'Hoàn thành').length,
      cancelled: orders.filter(o => o.status === 'Đã hủy').length,
      revenue: orders
        .filter(o => o.status === 'Hoàn thành')
        .reduce((sum, o) => sum + o.totalAmount, 0),
    };
  }, [orders]);

  return {
    orders,
    addOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
    getOrderById,
    getOrdersByStatus,
    getOrderStats,
  };
};
