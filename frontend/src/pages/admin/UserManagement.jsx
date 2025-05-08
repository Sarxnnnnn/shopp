// UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { Trash2, Pencil, PlusCircle, ReceiptText } from 'lucide-react';
import axios from 'axios';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useNotification } from '../../contexts/NotificationContext';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { admin } = useAdminAuth();
  const { showNotification } = useNotification();
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/admin/users/all', {
          headers: { 
            Authorization: `Bearer ${admin.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data.success) {
          setUsers(response.data.data);
        } else {
          throw new Error(response.data.message || 'ไม่สามารถดึงข้อมูลผู้ใช้ได้');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        showNotification(
          error.response?.data?.message || 'ไม่สามารถดึงข้อมูลผู้ใช้ได้', 
          'error'
        );
      } finally {
        setLoading(false);
      }
    };

    if (admin?.token) {
      fetchUsers();
    }
  }, [admin?.token, showNotification]);

  const handleEdit = async (updatedUser) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/admin/users/${updatedUser.id}`,
        updatedUser,
        {
          headers: { Authorization: `Bearer ${admin.token}` }
        }
      );
      
      if (response.data.success) {
        setUsers(users.map(user => 
          user.id === updatedUser.id ? response.data.data : user
        ));
        showNotification('อัพเดทข้อมูลผู้ใช้สำเร็จ', 'success');
        setShowEditModal(false);
      }
    } catch (error) {
      showNotification('ไม่สามารถอัพเดทข้อมูลผู้ใช้ได้', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${admin.token}` }
      });

      if (response.data.success) {
        setUsers(users.filter((user) => user.id !== id));
        showNotification('ลบผู้ใช้สำเร็จ', 'success');
      } else {
        showNotification(response.data.message || 'ไม่สามารถลบผู้ใช้ได้', 'error');
      }
    } catch (error) {
      console.error('Delete user error:', error);
      showNotification(
        error.response?.data?.message || 'ไม่สามารถลบผู้ใช้ได้', 
        'error'
      );
    }
  };

  const handleCreate = async (userData) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/admin/users/create',
        userData,
        {
          headers: { Authorization: `Bearer ${admin.token}` }
        }
      );
      
      if (response.data.success) {
        setUsers([...users, response.data.data]);
        setShowAddModal(false);
        showNotification('เพิ่มผู้ใช้สำเร็จ', 'success');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      showNotification(error.response?.data?.message || 'ไม่สามารถเพิ่มผู้ใช้ได้', 'error');
    }
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ReceiptText className="w-6 h-6 text-yellow-500" />
          <h1 className="text-2xl font-bold text-yellow-500">จัดการผู้ใช้</h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <PlusCircle size={20} />
          เพิ่มผู้ใช้
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse rounded-xl overflow-hidden shadow">
          <thead className="bg-yellow-500 text-white">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">ชื่อ</th>
              <th className="px-4 py-2 text-left">อีเมล</th>
              <th className="px-4 py-2">บทบาท</th>
              <th className="px-4 py-2">วันที่สมัคร</th>
              <th className="px-4 py-2">ยอดเงิน</th>
              <th className="px-4 py-2">จัดการ</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-200 dark:border-zinc-700">
                <td className="px-4 py-3">{user.id}</td>
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3 text-center">{user.role}</td>
                <td className="px-4 py-3 text-center">
                  {new Date(user.member_since || user.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-center">฿{user.balance?.toLocaleString() || 0}</td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingUser(user);
                      setShowEditModal(true);
                    }}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500 dark:text-gray-400">
                  ไม่มีข้อมูลผู้ใช้
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Overlays */}
      {(showEditModal || showAddModal) && (
        <div/>
      )}

      {showEditModal && (
        <div className="fixed inset-0 flex items-start justify-center mt-20 z-50">
          <div className="bg-white dark:bg-zinc-800 rounded-xl w-full max-w-xl shadow-2xl relative">
            <EditUserModal
              user={editingUser}
              onClose={() => {
                setShowEditModal(false);
                setEditingUser(null);
              }}
              onSave={handleEdit}
            />
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 flex items-start justify-center mt-20 z-50">
          <div className="bg-white dark:bg-zinc-800 rounded-xl w-full max-w-xl shadow-2xl relative">
            <AddUserModal
              onClose={() => setShowAddModal(false)}
              onSave={handleCreate}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function EditUserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    id: user.id,
    name: user.name,
    email: user.email,
    password: '', // Add empty password field
    role: user.role,
    balance: user.balance || 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        แก้ไขข้อมูลผู้ใช้
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
            ชื่อผู้ใช้
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                      bg-white dark:bg-zinc-700 text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-yellow-500 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
            อีเมล
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                      bg-white dark:bg-zinc-700 text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-yellow-500 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
            รหัสผ่านใหม่ (เว้นว่างถ้าไม่ต้องการเปลี่ยน)
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                      bg-white dark:bg-zinc-700 text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-yellow-500 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
              บทบาท
            </label>
            <select
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-zinc-700 text-gray-900 dark:text-white
                        focus:ring-2 focus:ring-yellow-500 transition-all"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
              ยอดเงิน
            </label>
            <input
              type="number"
              value={formData.balance}
              onChange={e => setFormData({...formData, balance: parseFloat(e.target.value)})}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-zinc-700 text-gray-900 dark:text-white
                        focus:ring-2 focus:ring-yellow-500 transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600
                    text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
                    transition-all duration-200"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-yellow-500 hover:bg-yellow-600
                    text-white transition-all duration-200"
          >
            บันทึก
          </button>
        </div>
      </form>
    </div>
  );
}

function AddUserModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    balance: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        เพิ่มผู้ใช้ใหม่
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
            ชื่อผู้ใช้
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                      bg-white dark:bg-zinc-700 text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-yellow-500 transition-all"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
            อีเมล
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                      bg-white dark:bg-zinc-700 text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-yellow-500 transition-all"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
            รหัสผ่าน
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                      bg-white dark:bg-zinc-700 text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-yellow-500 transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
              บทบาท
            </label>
            <select
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-zinc-700 text-gray-900 dark:text-white
                        focus:ring-2 focus:ring-yellow-500 transition-all"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
              ยอดเงิน
            </label>
            <input
              type="number"
              value={formData.balance}
              onChange={e => setFormData({...formData, balance: parseFloat(e.target.value)})}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-zinc-700 text-gray-900 dark:text-white
                        focus:ring-2 focus:ring-yellow-500 transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600
                    text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
                    transition-all duration-200"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-yellow-500 hover:bg-yellow-600
                    text-white transition-all duration-200"
          >
            บันทึก
          </button>
        </div>
      </form>
    </div>
  );
}
