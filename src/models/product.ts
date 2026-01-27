import { useState, useCallback, useEffect } from 'react';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
  { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
  { id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 5 },
  { id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 12 },
  { id: 6, name: 'AirPods Pro 2', category: 'Phụ kiện', price: 6000000, quantity: 0 },
  { id: 7, name: 'Samsung Galaxy Tab S9', category: 'Máy tính bảng', price: 15000000, quantity: 7 },
  { id: 8, name: 'Logitech MX Master 3', category: 'Phụ kiện', price: 2500000, quantity: 25 },
];

const STORAGE_KEY = 'products';

export const useProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);

  // Load từ localStorage khi component mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setProducts(JSON.parse(stored));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    }
  }, []);

  // Save vào localStorage mỗi khi products thay đổi
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    }
  }, [products]);

  const getProductStatus = (quantity: number) => {
    if (quantity > 10) return 'Còn hàng';
    if (quantity > 0) return 'Sắp hết';
    return 'Hết hàng';
  };

  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Math.max(...products.map(p => p.id), 0) + 1,
    };
    setProducts([...products, newProduct]);
    return newProduct;
  }, [products]);

  const updateProduct = useCallback((id: number, updates: Partial<Product>) => {
    setProducts(products.map(p => (p.id === id ? { ...p, ...updates } : p)));
  }, [products]);

  const deleteProduct = useCallback((id: number) => {
    setProducts(products.filter(p => p.id !== id));
  }, [products]);

  const getProductById = useCallback((id: number) => {
    return products.find(p => p.id === id);
  }, [products]);

  const getCategories = useCallback(() => {
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getCategories,
    getProductStatus,
  };
};
