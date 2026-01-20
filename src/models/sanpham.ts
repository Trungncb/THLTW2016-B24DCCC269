import { useState } from 'react';
import { message } from 'antd';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const initialProducts: Product[] = [
  { id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
  { id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
  { id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },
  { id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 },
];

export default () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [visible, setVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [searchText, setSearchText] = useState<string>('');

  // Get filtered products based on search text
  const getFilteredProducts = () => {
    if (!searchText.trim()) {
      return products;
    }
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  // Add or update product
  const handleSaveProduct = (formData: Omit<Product, 'id'>) => {
    if (isEdit && editingProduct) {
      // Update existing product
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id ? { ...p, ...formData } : p
        )
      );
      message.success('Cập nhật sản phẩm thành công!');
    } else {
      // Add new product
      const newProduct: Product = {
        id: Math.max(...products.map((p) => p.id), 0) + 1,
        ...formData,
      };
      setProducts([...products, newProduct]);
      message.success('Thêm sản phẩm thành công!');
    }
    setVisible(false);
    setIsEdit(false);
    setEditingProduct(undefined);
  };

  // Delete product
  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
    message.success('Xóa sản phẩm thành công!');
  };

  // Open modal to add new product
  const handleAddNew = () => {
    setIsEdit(false);
    setEditingProduct(undefined);
    setVisible(true);
  };

  // Open modal to edit product
  const handleEditProduct = (product: Product) => {
    setIsEdit(true);
    setEditingProduct(product);
    setVisible(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setVisible(false);
    setIsEdit(false);
    setEditingProduct(undefined);
  };

  return {
    products: getFilteredProducts(),
    allProducts: products,
    visible,
    setVisible,
    isEdit,
    setIsEdit,
    editingProduct,
    setEditingProduct,
    searchText,
    setSearchText,
    handleSaveProduct,
    handleDeleteProduct,
    handleAddNew,
    handleEditProduct,
    handleCloseModal,
  };
};
