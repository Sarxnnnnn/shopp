import React from 'react';
import * as LucideIcons from 'lucide-react';

const IconPicker = ({ onSelect, onClose }) => {
  const icons = Object.entries(LucideIcons)
    .filter(([name]) => name !== 'createLucideIcon' && !name.includes('Default'));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 w-[480px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">เลือกไอคอน</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {icons.map(([name, Icon]) => (
            <button
              key={name}
              onClick={() => onSelect(name)}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex flex-col items-center gap-1"
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IconPicker;
