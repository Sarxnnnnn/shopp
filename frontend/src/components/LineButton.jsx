import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaLine, FaTimes } from 'react-icons/fa';

const LineButton = () => {
  const [lineId, setLineId] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/site-settings');
        if (response.data && response.data.line_id) {
          setLineId(response.data.line_id);
        }
      } catch (error) {
        console.error('Error fetching Line ID:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleClick = () => {
    if (lineId) {
      window.open(`${lineId}`, '_blank');
      setIsExpanded(false); // Close the panel after clicking
    }
  };

  return (
    <div className="fixed bottom-0 right-0 z-50 mb-4">
      <div 
        className={`flex items-center gap-3 transition-all duration-300 ease-in-out
          ${isExpanded ? 'mr-4 bg-white rounded-lg shadow-xl p-4' : 'mr-0'}`}
      >
        {isExpanded && (
          <div className="flex flex-col items-start gap-3">
            <span className="text-gray-700 font-medium">ติดต่อเราทางไลน์</span>
            <button
              onClick={handleClick}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg
                transition-all duration-300 flex items-center gap-2"
            >
              <FaLine size={20} />
              <span>แอดไลน์</span>
            </button>
          </div>
        )}
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`bg-green-500 text-white p-4 shadow-lg 
            hover:bg-green-600 transition-all duration-300 ease-in-out
            hover:scale-105 hover:shadow-xl
            flex items-center justify-center relative
            ${isExpanded ? 'rounded-lg' : 'rounded-l-lg'}
            ${!isExpanded && 'animate-pulse-slow before:content-[\'\'] before:absolute before:inset-0 before:rounded-l-lg before:bg-green-500 before:animate-ping-slow before:opacity-75'}`}
          title={isExpanded ? "ปิด" : "ติดต่อทางไลน์"}
        >
          {isExpanded ? (
            <FaTimes size={24} />
          ) : (
            <FaLine size={24} className="relative z-10" />
          )}
        </button>
      </div>
    </div>
  );
};

export default LineButton;
