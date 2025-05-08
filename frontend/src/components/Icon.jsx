import React, { useState } from 'react';
import {
  Phone, Mail, Clock, FileText, Shield, Lock, User, Database,
  Home, Star, Heart, ShoppingCart, Gift, Truck,
  CreditCard, Wallet, Bell, Settings, Map, Store,
  MessageCircle, Calendar, Book, Link, Image, Save,
  Edit, Trash, Eye, Search, Filter, Share,
  Facebook, Instagram, Twitter, Youtube
} from 'lucide-react';

// ไอคอนที่มีให้เลือกใช้
const availableIcons = {
  // ไอคอนทั่วไป
  home: <Home />,
  star: <Star />,
  heart: <Heart />,
  phone: <Phone />,
  mail: <Mail />,
  clock: <Clock />,
  calendar: <Calendar />,

  // ไอคอนสำหรับร้านค้า
  cart: <ShoppingCart />,
  store: <Store />,
  gift: <Gift />,
  truck: <Truck />,

  // ไอคอนการเงิน
  wallet: <Wallet />,
  creditcard: <CreditCard />,

  // ไอคอนสื่อสาร
  message: <MessageCircle />,
  bell: <Bell />,

  // ไอคอนเอกสารและไฟล์
  file: <FileText />,
  book: <Book />,
  image: <Image />,
  link: <Link />,
  save: <Save />,

  // ไอคอนความปลอดภัย
  shield: <Shield />,
  lock: <Lock />,
  user: <User />,
  database: <Database />,

  // ไอคอนจัดการ
  settings: <Settings />,
  edit: <Edit />,
  trash: <Trash />,
  eye: <Eye />,
  search: <Search />,
  filter: <Filter />,
  share: <Share />,
  map: <Map />,

  // โซเชียลมีเดีย
  facebook: <Facebook />,
  instagram: <Instagram />,
  twitter: <Twitter />,
  youtube: <Youtube />
};

// จัดกลุ่มไอคอน
const iconCategories = {
  'ทั่วไป': ['home', 'star', 'heart', 'phone', 'mail', 'clock', 'calendar'],
  'ร้านค้า': ['cart', 'store', 'gift', 'truck'],
  'การเงิน': ['wallet', 'creditcard'],
  'การสื่อสาร': ['message', 'bell'],
  'เอกสาร': ['file', 'book', 'image', 'link', 'save'],
  'ความปลอดภัย': ['shield', 'lock', 'user', 'database'],
  'การจัดการ': ['settings', 'edit', 'trash', 'eye', 'search', 'filter', 'share', 'map'],
  'โซเชียล': ['facebook', 'instagram', 'twitter', 'youtube']
};

// Export icons and categories for external use
export { availableIcons, iconCategories };

const Icon = ({ url, name, size = "24", onClick, className, showModal, onClose }) => {
  if (url || (name && availableIcons[name])) {
    const icon = url ? (
      <img src={url} alt={name} width={size} height={size} className={className} />
    ) : (
      React.cloneElement(availableIcons[name], { size, className })
    );

    return (
      <>
        {icon}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">เลือกไอคอน</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {Object.entries(iconCategories).map(([category, iconNames]) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      {category}
                    </h4>
                    <div className="grid grid-cols-6 gap-2">
                      {iconNames.map(iconName => (
                        <button
                          key={iconName}
                          onClick={() => {
                            onClick?.(iconName);
                            onClose();
                          }}
                          className="p-3 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex flex-col items-center gap-1"
                        >
                          {React.cloneElement(availableIcons[iconName], { size })}
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {iconName}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (showModal) {
    return (
      <div className="space-y-6">
        {Object.entries(iconCategories).map(([category, iconNames]) => (
          <div key={category}>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              {category}
            </h4>
            <div className="grid grid-cols-6 gap-2">
              {iconNames.map(iconName => (
                <button
                  key={iconName}
                  onClick={() => onClick?.(iconName)}
                  className="p-3 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex flex-col items-center gap-1"
                >
                  {React.cloneElement(availableIcons[iconName], { size })}
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {iconName}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default Icon;
