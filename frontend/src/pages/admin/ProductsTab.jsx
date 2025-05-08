import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminTable from '../../components/admin/AdminTable';

const ProductsTab = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/admin/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'name', title: 'Name' },
    { key: 'price', title: 'Price' },
    { key: 'stock', title: 'Stock' },
    { key: 'description', title: 'Description' },
    { key: 'status', title: 'Status' },
    { key: 'image', title: 'Image' },
    { key: 'created_at', title: 'Created At' },
  ];

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Products</h2>
      <AdminTable data={products} columns={columns} />
    </div>
  );
};

export default ProductsTab;
