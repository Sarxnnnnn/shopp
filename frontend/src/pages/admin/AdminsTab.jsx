import React, { useState, useEffect } from 'react';
import { PlusCircle, ReceiptText } from 'lucide-react';
import axios from 'axios';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useNotification } from '../../contexts/NotificationContext';

export default function AdminsTab() {
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [loading, setLoading] = useState(false); 
  const { admin } = useAdminAuth();
  const { showNotification } = useNotification();
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, [admin.token]);

  const fetchAdmins = async () => {
    try {
      setLoading(true); 
      const response = await axios.get('http://localhost:3000/api/admin/admins', {
        headers: { Authorization: `Bearer ${admin.token}` }
      });
      
      if (response.data.success) {
        setAdmins(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching admins');
      console.error('Error fetching admins:', err);
      showNotification(
        err.response?.data?.message || 'ไม่สามารถโหลดข้อมูลแอดมินได้', 
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (adminData = null) => {
    setEditingAdmin(adminData);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/admins/${id}`, {
        headers: { Authorization: `Bearer ${admin.token}` }
      });
      setAdmins(admins.filter(a => a.id !== id));
      showNotification('ลบแอดมินสำเร็จ', 'success');
    } catch (error) {
      showNotification('ไม่สามารถลบแอดมินได้', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ReceiptText className="w-6 h-6 text-yellow-500" />
          <h1 className="text-2xl font-bold text-yellow-500">จัดการแอดมิน</h1>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition"
        >
          <PlusCircle size={18} />
          เพิ่มแอดมินใหม่
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse rounded-xl overflow-hidden shadow">
          <thead className="bg-yellow-500 text-white">
            <tr>
              <th className="px-4 py-2 text-left">ชื่อ</th>
              <th className="px-4 py-2 text-left">อีเมล</th>
              <th className="px-4 py-2">ระดับ</th>
              <th className="px-4 py-2">วันที่สร้าง</th>
              <th className="px-4 py-2">จัดการ</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-200">
            {admins.map((admin) => (
              <tr key={admin.id} className="border-b border-gray-200 dark:border-zinc-700">
                <td className="px-4 py-3">{admin.name}</td>
                <td className="px-4 py-3">{admin.email}</td>
                <td className="px-4 py-3 text-center">{admin.role}</td>
                <td className="px-4 py-3 text-center">
                  {new Date(admin.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleOpenModal(admin)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDelete(admin.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <AdminModal
          admin={editingAdmin}
          onClose={() => {
            setShowModal(false);
            setEditingAdmin(null);
          }}
          onSave={(data) => {
            fetchAdmins();
            setShowModal(false);
          }}
          currentAdminToken={admin.token}
        />
      )}
    </div>
  );
}

function AdminModal({ admin, onClose, onSave, currentAdminToken }) {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: admin?.name || '',
    email: admin?.email || '',
    password: '',
    role: admin?.role || 'admin'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (admin?.id) {
        await axios.put(`http://localhost:3000/api/admin/admins/${admin.id}`, formData, {
          headers: { Authorization: `Bearer ${currentAdminToken}` }
        });
        showNotification('อัพเดทข้อมูลแอดมินสำเร็จ', 'success');
      } else {
        await axios.post('http://localhost:3000/api/admin/admins', formData, {
          headers: { Authorization: `Bearer ${currentAdminToken}` }
        });
        showNotification('เพิ่มแอดมินใหม่สำเร็จ', 'success');
      }
      onSave();
    } catch (error) {
      console.error('Error saving admin:', error);
      showNotification(
        error.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
        'error'
      );
    }
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center mt-20 z-50">
      <div className="bg-white dark:bg-zinc-800 rounded-xl w-full max-w-md p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {admin ? 'แก้ไขแอดมิน' : 'เพิ่มแอดมินใหม่'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ชื่อ
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              อีเมล
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              รหัสผ่าน {admin && '(เว้นว่างถ้าไม่ต้องการเปลี่ยน)'}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
              {...(!admin && { required: true })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ระดับ
            </label>
            <select
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                      text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
