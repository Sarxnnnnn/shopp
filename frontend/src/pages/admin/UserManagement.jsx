// UserManagement.jsx
import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'สมชาย ตัวอย่าง', email: 'somchai@example.com', role: 'ผู้ใช้ทั่วไป', status: 'ใช้งานอยู่' },
  { id: 2, name: 'สมหญิง ทดสอบ', email: 'somying@example.com', role: 'ผู้ดูแลระบบ', status: 'ระงับการใช้งาน' },
];

export default function UserManagement() {
  const [users, setUsers] = useState(mockUsers);

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-500">จัดการผู้ใช้</h1>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse rounded-xl overflow-hidden shadow">
          <thead className="bg-yellow-500 text-white">
            <tr>
              <th className="px-4 py-2 text-left">ชื่อ</th>
              <th className="px-4 py-2 text-left">อีเมล</th>
              <th className="px-4 py-2">บทบาท</th>
              <th className="px-4 py-2">สถานะ</th>
              <th className="px-4 py-2">จัดการ</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-200 dark:border-zinc-700">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3 text-center">{user.role}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2 py-1 text-sm rounded-full ${
                      user.status === 'ใช้งานอยู่'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => handleDelete(user.id)} className="text-red-500 dark:text-red-400 hover:underline">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500 dark:text-gray-400">
                  ไม่มีข้อมูลผู้ใช้
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
