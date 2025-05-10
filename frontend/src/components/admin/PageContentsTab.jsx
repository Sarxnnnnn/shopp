import React, { useState, useEffect } from 'react';
import { Settings, Save, Plus, Trash, X, Search } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { availableIcons, iconCategories } from '../../components/Icon';
import axios from 'axios';

const PageContentsTab = () => {
  const { admin } = useAdminAuth();
  const { showNotification } = useNotification();
  const [contents, setContents] = useState({});
  const [sections, setSections] = useState({});
  const [activeTab, setActiveTab] = useState('about');
  const [loading, setLoading] = useState(true);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(null);
  const [iconSearch, setIconSearch] = useState('');

  const tabs = [
    { id: 'about', name: 'เกี่ยวกับเรา' },
    { id: 'contact', name: 'ช่องทางการติดต่อ' },
    { id: 'privacy', name: 'นโยบายความเป็นส่วนตัว' },
    { id: 'terms', name: 'เงื่อนไขการให้บริการ' },
    { id: 'faq', name: 'คำถามที่พบบ่อย' }
  ];

  useEffect(() => {
    fetchContents();
    fetchSections();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await axios.get('/api/admin/page-contents', {
        headers: { Authorization: `Bearer ${admin.token}` }
      });
      const contentMap = {};
      response.data.data.forEach(item => {
        contentMap[item.page_name] = item;
      });
      setContents(contentMap);
      setLoading(false);
    } catch (error) {
      showNotification('ไม่สามารถโหลดข้อมูลได้', 'error');
    }
  };

  const fetchSections = async () => {
    try {
      const response = await axios.get('/api/admin/page-sections', {
        headers: { Authorization: `Bearer ${admin.token}` }
      });
      const sectionMap = {};
      response.data.data.forEach(item => {
        if (!sectionMap[item.page_name]) {
          sectionMap[item.page_name] = [];
        }
        sectionMap[item.page_name].push(item);
      });
      setSections(sectionMap);
    } catch (error) {
      showNotification('ไม่สามารถโหลดข้อมูลส่วนย่อยได้', 'error');
    }
  };

  const handleSubmit = async (pageName) => {
    try {
      await axios.put(
        `/api/admin/page-contents/${pageName}`,
        contents[pageName],
        { headers: { Authorization: `Bearer ${admin.token}` }}
      );

      if (sections[pageName]) {
        await axios.put(
          `/api/admin/page-sections/${pageName}`,
          { sections: sections[pageName] },
          { headers: { Authorization: `Bearer ${admin.token}` }}
        );
      }

      showNotification('บันทึกข้อมูลเรียบร้อย', 'success');
    } catch (error) {
      showNotification('ไม่สามารถบันทึกข้อมูลได้', 'error');
    }
  };

  const handleChange = (field, value) => {
    setContents(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: value
      }
    }));
  };

  const handleChangeSection = (index, field, value) => {
    setSections(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map((section, i) => 
        i === index ? { ...section, [field]: value } : section
      )
    }));
  };

  const addSection = () => {
    setSections(prev => ({
      ...prev,
      [activeTab]: [
        ...(prev[activeTab] || []),
        {
          page_name: activeTab,
          section_key: `section_${Date.now()}`,
          title: '',
          content: '',
          icon: '',
          order_index: prev[activeTab]?.length || 0
        }
      ]
    }));
  };

  const removeSection = (index) => {
    setSections(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((_, i) => i !== index)
    }));
  };

  const handleIconSelect = (iconName) => {
    handleChangeSection(selectedSectionIndex, 'icon', iconName);
    setShowIconPicker(false);
  };

  const openIconPicker = (index) => {
    setSelectedSectionIndex(index);
    setShowIconPicker(true);
  };

  const filterIcons = (icons) => {
    return icons.filter(icon => 
      icon.toLowerCase().includes(iconSearch.toLowerCase())
    );
  };

  if (loading) return <div>กำลังโหลด...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-yellow-500" />
        <h1 className="text-2xl font-bold text-yellow-500">จัดการเนื้อหาเว็บไซต์</h1>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow border border-gray-200 dark:border-zinc-800">
        <div className="flex space-x-4 border-b border-gray-200 dark:border-zinc-700 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-4 border-b-2 ${
                activeTab === tab.id
                  ? 'border-yellow-500 text-yellow-500'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {contents[activeTab] && (
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b pb-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">เนื้อหาหลัก</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">หัวข้อ</label>
                  <input
                    type="text"
                    value={contents[activeTab].title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">เนื้อหา</label>
                  <textarea
                    value={contents[activeTab].content || ''}
                    onChange={(e) => handleChange('content', e.target.value)}
                    rows="5"
                    className="w-full p-2 border rounded-lg dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b pb-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">เนื้อหาย่อย</h2>
                <button onClick={addSection} className="ml-auto px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                  <Plus size={16} className="inline mr-1" />
                  เพิ่มเนื้อหาย่อย
                </button>
              </div>
              <div className="space-y-6">
                {sections[activeTab]?.map((section, index) => (
                  <div key={index} className="border p-4 rounded-lg relative">
                    <button
                      onClick={() => removeSection(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-600"
                    >
                      <Trash size={16} />
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">หัวข้อย่อย</label>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => handleChangeSection(index, 'title', e.target.value)}
                          className="w-full p-2 border rounded-lg dark:bg-gray-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">ไอคอน</label>
                        <button
                          onClick={() => openIconPicker(index)}
                          className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
                        >
                          {section.icon && availableIcons[section.icon] ? (
                            <>
                              {React.cloneElement(availableIcons[section.icon], { size: 20 })}
                              <span>{section.icon}</span>
                            </>
                          ) : (
                            <span>เลือกไอคอน</span>
                          )}
                        </button>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-2">เนื้อหา</label>
                        <textarea
                          value={section.content}
                          onChange={(e) => handleChangeSection(index, 'content', e.target.value)}
                          rows="3"
                          className="w-full p-2 border rounded-lg dark:bg-gray-700"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button
                onClick={() => handleSubmit(activeTab)}
                className="px-6 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 flex items-center gap-2"
              >
                <Save size={20} />
                บันทึกการเปลี่ยนแปลง
              </button>
            </div>
          </div>
        )}
      </div>

      {showIconPicker && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-black bg-opacity-75" onClick={() => setShowIconPicker(false)} />
            <div className="relative inline-block w-full max-w-3xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-zinc-800 rounded-lg shadow-xl">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-yellow-500">เลือกไอคอน</h3>
                  <button 
                    onClick={() => setShowIconPicker(false)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>
                <div className="mt-4 relative">
                  <input
                    type="text"
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                    placeholder="ค้นหาไอคอน..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
              </div>
              <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 140px)' }}>
                <div className="space-y-6">
                  {Object.entries(iconCategories).map(([category, iconNames]) => {
                    const filteredIcons = filterIcons(iconNames);
                    if (filteredIcons.length === 0) return null;

                    return (
                      <div key={category}>
                        <h4 className="text-sm font-medium text-yellow-500 mb-3">
                          {category}
                        </h4>
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                          {filteredIcons.map(iconName => (
                            <button
                              key={iconName}
                              onClick={() => handleIconSelect(iconName)}
                              className="flex flex-col items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-yellow-50 dark:hover:bg-gray-700 transition-colors group"
                            >
                              {React.cloneElement(availableIcons[iconName], { 
                                size: 24,
                                className: "text-gray-600 dark:text-gray-300 group-hover:text-yellow-500"
                              })}
                              <span className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-yellow-500">
                                {iconName}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageContentsTab;
