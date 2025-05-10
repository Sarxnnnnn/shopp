import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tag } from 'lucide-react';

const EditProductModal = ({ product, onClose, onUpdate }) => {
  const [form, setForm] = useState(product || {});
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('/api/admin/product-tags');
        if (response.data.success) {
          setTags(response.data.data);
          if (!form.tag && response.data.data.length > 0) {
            setForm(prev => ({
              ...prev,
              tag: response.data.data[0].name
            }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-xl w-full">
        <h2 className="text-xl font-semibold mb-4">แก้ไขสินค้า</h2>
        <form onSubmit={handleSubmit}>
          {/* แท็กสินค้า */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              <Tag className="inline-block w-4 h-4 mr-2" />
              แท็กสินค้า
            </label>
            <select
              name="tag"
              value={form.tag || 'normal'}
              onChange={handleChange}
              disabled={loading}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {loading ? (
                <option value="">กำลังโหลด...</option>
              ) : (
                tags.map(tag => (
                  <option key={tag.id} value={tag.name}>
                    {tag.display_name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-300 rounded-lg dark:bg-gray-700"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
