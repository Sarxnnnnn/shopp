import React, { useState } from 'react';

const IconSelector = ({ value, onChange }) => {
  const [iconUrl, setIconUrl] = useState(value || '');
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e) => {
    const url = e.target.value;
    setIconUrl(url);
    onChange(url);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Icon URL</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={iconUrl}
          onChange={handleChange}
          placeholder="วาง URL ของ icon ที่นี่..."
          className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          {showPreview ? 'ซ่อน' : 'ดูตัวอย่าง'}
        </button>
      </div>

      {/* Icon Preview */}
      {showPreview && iconUrl && (
        <div className="mt-2 p-4 border rounded dark:border-gray-600 flex items-center gap-4">
          <img 
            src={iconUrl}
            alt="Icon Preview"
            className="w-6 h-6"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-icon.png';
            }}
          />
          <span className="text-sm text-gray-500">ตัวอย่าง Icon</span>
        </div>
      )}

      {/* Quick Guide */}
      <div className="text-xs text-gray-500 mt-1">
        <p>แนะนำ: คุณสามารถค้นหา icon ได้จาก:</p>
        <ul className="list-disc list-inside">
          <li><a href="https://heroicons.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Heroicons</a></li>
          <li><a href="https://lucide.dev" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Lucide Icons</a></li>
          <li><a href="https://icons8.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Icons8</a></li>
        </ul>
      </div>
    </div>
  );
};

export default IconSelector;
