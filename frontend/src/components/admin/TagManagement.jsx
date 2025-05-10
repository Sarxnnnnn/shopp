import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotification } from '../../contexts/NotificationContext';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const TagManagement = ({ onClose }) => {
  const { admin } = useAdminAuth();
  const { showNotification } = useNotification();
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admin/product-tags', {
          headers: { Authorization: `Bearer ${admin.token}` }
        });
        if (response.data.success) {
          setTags(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
        showNotification('ไม่สามารถโหลดข้อมูลแท็กได้', 'error');
      }
    };
    fetchTags();
  }, []);

  const handleSave = async (tag) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/admin/product-tags/${tag.id}`,
        tag,
        {
          headers: {
            'Authorization': `Bearer ${admin.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setTags(tags.map(t => t.id === tag.id ? tag : t));
        setSelectedTag(null);
        showNotification('บันทึกแท็กสำเร็จ', 'success');
      }
    } catch (err) {
      console.error('Error saving tag:', err);
      showNotification('ไม่สามารถบันทึกแท็กได้', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-800 rounded-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">จัดการแท็ก</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          {tags.map(tag => (
            <div 
              key={tag.id} 
              className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-zinc-700/50 rounded-lg"
            >
              <div className={`w-4 h-4 rounded-full ${tag.color}`} />
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-gray-100">{tag.display_name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{tag.name}</div>
              </div>
              <button
                onClick={() => setSelectedTag(tag)}
                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                แก้ไข
              </button>
            </div>
          ))}
        </div>

        {selectedTag && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-800 rounded-xl w-full max-w-md p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">แก้ไขแท็ก</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    ชื่อที่แสดง
                  </label>
                  <input
                    type="text"
                    value={selectedTag.display_name}
                    onChange={e => setSelectedTag({...selectedTag, display_name: e.target.value})}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-zinc-700 
                             text-gray-900 dark:text-gray-100 
                             border-gray-300 dark:border-gray-600
                             focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-600
                             transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    สี
                  </label>
                  <select
                    value={selectedTag.color}
                    onChange={e => setSelectedTag({...selectedTag, color: e.target.value})}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-zinc-700 
                             text-gray-900 dark:text-gray-100 
                             border-gray-300 dark:border-gray-600
                             focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-600
                             transition-colors"
                  >
                    <option value="bg-gray-500">เทา</option>
                    <option value="bg-red-500">แดง</option>
                    <option value="bg-yellow-500">เหลือง</option>
                    <option value="bg-green-500">เขียว</option>
                    <option value="bg-blue-500">น้ำเงิน</option>
                    <option value="bg-purple-500">ม่วง</option>
                    <option value="bg-pink-500">ชมพู</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => setSelectedTag(null)}
                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 
                             bg-gray-100 dark:bg-zinc-700 
                             rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600
                             transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={() => handleSave(selectedTag)}
                    className="px-4 py-2 text-sm text-white 
                             bg-yellow-500 hover:bg-yellow-600 
                             rounded-lg transition-colors"
                  >
                    บันทึก
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagManagement;
