import React from 'react';
import SiteSettingsForm from '../../components/admin/SiteSettingsForm';
import { LayoutDashboard } from 'lucide-react';

const SiteManagementPage = () => {
  return (
    <div className="p-6">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-yellow-500" />
          <h1 className="text-2xl font-bold text-yellow-500">จัดการหน้าเว็บไซต์</h1>
        </div>
      <div className="bg-white rounded-lg shadow p-6">
        <SiteSettingsForm />
      </div>
    </div>
  );
};

export default SiteManagementPage;
