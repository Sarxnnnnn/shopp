import { useContext, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaEnvelope, FaFileContract, FaShieldAlt, FaInfoCircle, FaQuestionCircle } from 'react-icons/fa';
import { LiaWindowRestore } from 'react-icons/lia';
import { MdFiberNew } from 'react-icons/md';
import { TbChartBar } from 'react-icons/tb';
import { FiSettings, FiLogOut } from 'react-icons/fi';
import { LogOut, Wallet, Settings, History } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useBalance } from '../contexts/BalanceContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import axios from 'axios';
import { fetchBalance } from '../utils/api';
import Icon from './Icon';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const Navbar = () => {
  const { balance, setBalance } = useBalance();
  const { user, setUser, logout } = useAuth();
  const { admin, logout: adminLogout } = useAdminAuth();
  const { settings } = useSiteSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showLoginPopup, setShowLoginPopup] = useState(true);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const mobileNavRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const settingsMenuRef = useRef(null);
  const [userInfo, setUserInfo] = useState(null);
  const [navItems, setNavItems] = useState([]);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      logout();
      setPopupMessage('ออกจากระบบแล้ว');
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const fetchUserInfo = async () => {
    const token = localStorage.getItem('userToken') || localStorage.getItem('token');
    if (!token) return;
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUserInfo(response.data);
    } catch (error) {
      console.error('Error fetching user info:', error);
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  useEffect(() => {
    if (user && showLoginPopup) {
      fetchUserInfo();
      setPopupMessage('เข้าสู่ระบบสำเร็จ!');
      setShowLoginPopup(false);
    }
  }, [user]);

  useEffect(() => {
    if (!popupMessage) return;
    const timer = setTimeout(() => setPopupMessage(''), 3000);
    return () => clearTimeout(timer);
  }, [popupMessage]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && 
          mobileNavRef.current && 
          !mobileNavRef.current.contains(e.target) &&
          !toggleButtonRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(e.target)) {
        setShowSettingsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const loadBalance = async () => {
      const token = localStorage.getItem('userToken') || localStorage.getItem('token');
      if (!token) return;
      
      try {
        const response = await fetchBalance(token);
        if (response.success) {
          setBalance(response.balance);
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
        if (error.message.includes('โทเค็นไม่ถูกต้อง')) {
          logout();
        }
      }
    };

    if (user) {
      loadBalance();
    }
  }, [user, logout]);

  useEffect(() => {
    const fetchNavItems = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/navigation-items`);
        if (response.data.success) {
          const activeItems = response.data.data.filter(item => item.is_active);
          setNavItems(activeItems);
        }
      } catch (error) {
        console.error('Error fetching nav items:', error);
      }
    };

    fetchNavItems();
  }, []);

  const menuItems = [
    { name: 'หน้าหลัก', icon: <FaHome size={20} />, path: '/' },
    ...navItems.map(item => ({
      name: item.display_name,
      icon: <Icon name={item.icon} size="20" />,
      path: item.path
    })),
    { divider: true },
    { name: 'ช่องทางการติดต่อ', icon: <FaEnvelope size={20} />, path: '/contact' },
    { name: 'เงื่อนไขการให้บริการ', icon: <FaFileContract />, path: '/terms' },
    { name: 'นโยบายความเป็นส่วนตัว', icon: <FaShieldAlt />, path: '/privacy' },
    { name: 'เกี่ยวกับเรา', icon: <FaInfoCircle />, path: '/about' },
    { name: 'คำถามที่พบบ่อย', icon: <FaQuestionCircle />, path: '/faq' },
  ];

  const authButtonStyle = (path) =>
    `px-3 py-1 rounded border transition-all duration-300 text-sm transform hover:scale-105 ${
      location.pathname === path
        ? 'bg-yellow-400 text-black shadow-lg'
        : 'hover:bg-gray-700 border-white hover:border-yellow-400'
    }`;

  const iconButtonStyle =
    'relative flex items-center gap-2 px-3 py-2 rounded transition-all duration-300 text-sm hover:bg-gray-700 hover:scale-105 hover:text-yellow-400';

  const topBarButtonStyle = `
    flex items-center gap-2 px-4 py-2 rounded-lg
    transition-all duration-300
    bg-gradient-to-r from-gray-800 to-gray-900
    hover:from-gray-700 hover:to-gray-800
    border border-gray-700
    hover:border-yellow-500
    transform hover:scale-105
    shadow-lg hover:shadow-yellow-500/20
  `;

  const avatarUrl = '/default-avatar.png';

  const handleNavigate = (path) => {
    navigate(path);
    setShowSettingsMenu(false);
  };

  const renderSettingsButton = () => (
    <div className="relative" ref={settingsMenuRef}>
      <button
        onClick={() => setShowSettingsMenu(!showSettingsMenu)}
        className={`${topBarButtonStyle} text-sm font-medium text-gray-200`}
      >
        <Settings className="h-5 w-5 transition-transform duration-700 hover:rotate-180" />
        เมนู
      </button>

      {showSettingsMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-black/90 text-white px-4 py-3 rounded-lg shadow-lg z-[60] backdrop-blur-sm animate-fadeIn">
          <button
            type="button"
            onClick={() => handleNavigate('/order-history')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-300 hover:translate-x-2 hover:text-yellow-400 hover:bg-white/10"
          >
            <History className="h-4 w-4" />
            ประวัติคำสั่งซื้อ
          </button>
          <button
            type="button"
            onClick={() => handleNavigate('/account-settings')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-300 hover:translate-x-2 hover:text-yellow-400 hover:bg-white/10"
          >
            <Settings className="h-4 w-4" />
            ตั้งค่าบัญชี
          </button>
          <div className="border-t border-white/20 my-2"></div>
          <button
            type="button"
            onClick={() => {
              handleLogout();
              setShowSettingsMenu(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-300 hover:translate-x-2 hover:text-red-400 hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
            ออกจากระบบ
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {popupMessage && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 transform transition-all duration-300 animate-bounce">
          {popupMessage}
        </div>
      )}

      <div className="hidden md:flex fixed top-0 right-0 w-[calc(100%-15rem)] justify-end bg-black text-white p-4 z-40 shadow-lg backdrop-blur-sm bg-opacity-90">
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          {admin ? (
            <>
              <Link
                to="/admin"
                className="flex items-center gap-2 hover:text-yellow-400 transition-colors"
              >
                <FiSettings className="text-lg" />
                แดชบอร์ดแอดมิน
              </Link>
              <button
                onClick={adminLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-500 dark:text-gray-200 dark:hover:text-red-400"
              >
                <LogOut size={20} />
                ออกจากระบบ
              </button>
            </>
          ) : !user ? (
            <>
              <Link to="/login" className={authButtonStyle('/login')}>เข้าสู่ระบบ</Link>
              <Link to="/register" className={authButtonStyle('/register')}>สมัครสมาชิก</Link>
            </>
          ) : (
            <>
              <Link
                to="/topup"
                className={`${topBarButtonStyle} text-sm font-medium text-gray-200`}
              >
                <Wallet className="h-5 w-5 animate-bounce" />
                <span className="flex items-center gap-1">
                  <span className="font-bold text-yellow-400">
                    {balance ? balance.toLocaleString() : '0'} บาท
                  </span>
                </span>
              </Link>
              <Link
                to="/order-history"
                className={`${topBarButtonStyle} text-sm font-medium text-gray-200 group`}
              >
                <History className="h-5 w-5 transition-all duration-700 group-hover:rotate-[360deg] group-hover:text-yellow-400" />
              </Link>
              <Link
                to="/account-settings"
                className={`${topBarButtonStyle} text-sm font-medium text-gray-200 group`}
              >
                <Settings className="h-5 w-5 transition-all duration-700 group-hover:rotate-[360deg] group-hover:text-yellow-400"/>
              </Link>
              <button
                onClick={handleLogout}
                className={`${topBarButtonStyle} text-sm font-medium text-red-400 hover:text-red-300`}
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col fixed top-0 left-0 h-full w-60 bg-black text-white p-6 z-50 shadow-xl backdrop-blur-sm bg-opacity-90">
        {admin || user ? (
          <div className="flex items-center gap-4 mb-6">
            {settings?.logo && (
              <img 
                src={settings.logo} 
                alt="Logo" 
                className="h-10 w-auto object-contain"
              />
            )}
            <h1 
              className="text-2xl font-bold"
              style={{ color: settings?.theme_color || '#FFB547' }}
            >
              {settings?.website_name || ''}
            </h1>
          </div>
        ) : (
          <Link 
            to="/admin/login"
            className="flex items-center gap-4 mb-6"
          >
            {settings?.logo && (
              <img 
                src={settings.logo} 
                alt="Logo" 
                className="h-10 w-auto object-contain"
              />
            )}
            <h1 
              className="text-2xl font-bold"
              style={{ color: settings?.theme_color || '#FFB547' }}
            >
              {settings?.website_name || ''}
            </h1>
          </Link>
        )}
        <div className="space-y-1 mt-10">
          {menuItems.map((item, idx) =>
            item.divider ? (
              <div key={`divider-${idx}`} className="border-t border-white/20 my-3" />
            ) : (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-300 transform hover:translate-x-2 ${
                    isActive
                      ? 'bg-white/20 font-semibold text-yellow-400 shadow-lg'
                      : 'hover:bg-white/10 hover:text-yellow-400'
                  }`
                }
              >
                <span className="transition-transform duration-300 group-hover:scale-110">
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </NavLink>
            )
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 w-full bg-black text-white p-4 flex justify-between items-center z-50">
        {admin || user ? (
          <div className="flex items-center gap-2">
            {settings?.logo ? (
              <img 
                src={settings.logo} 
                alt="Logo" 
                className="h-8 w-auto object-contain"
              />
            ) : null}
            <h1 
              className="text-xl font-bold"
              style={{ color: settings?.theme_color || '#FFB547' }}
            >
              {settings?.website_name || ''}
            </h1>
          </div>
        ) : (
          <Link 
            to="/admin"
            className="flex items-center gap-2 group"
          >
            {settings?.logo ? (
              <img 
                src={settings.logo} 
                alt="Logo" 
                className="h-8 w-auto object-contain group-hover:opacity-80 transition-opacity"
              />
            ) : null}
            <h1 
              className="text-xl font-bold transition-all duration-300 group-hover:text-yellow-400"
              style={{ color: settings?.theme_color || '#FFB547' }}
            >
              {settings?.website_name || ''}
            </h1>
          </Link>
        )}
        <div className="flex items-center gap-2">
          {admin ? (
            <>
              <Link
                to="/admin"
                className="flex items-center gap-2 hover:text-yellow-400 transition-colors"
              >
                <FiSettings className="text-lg" />
                แดชบอร์ดแอดมิน
              </Link>
              <button
                onClick={adminLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-500"
              >
                <LogOut size={20} />
                ออกจากระบบ
              </button>
            </>
          ) : !user ? (
            <>
              <Link to="/login" className={authButtonStyle('/login')}>เข้าสู่ระบบ</Link>
              <Link to="/register" className={authButtonStyle('/register')}>สมัครสมาชิก</Link>
            </>
          ) : (
            <>
              <Link
                to="/topup"
                className={`${topBarButtonStyle} text-sm font-medium text-gray-200`}
              >
                <Wallet className="h-5 w-5 animate-bounce" />
                  <span className="font-bold text-yellow-400">
                    {balance ? balance.toLocaleString() : '0'} บาท
                </span>
              </Link>
              {renderSettingsButton()}
            </>
          )}
          <ThemeToggle />
          <button 
            ref={toggleButtonRef}
            onClick={handleToggle} 
            className="w-10 h-10 flex items-center justify-center rounded-lg
              transition-all duration-300
              bg-gradient-to-r from-gray-800 to-gray-900
              hover:from-gray-700 hover:to-gray-800
              border border-gray-700
              hover:border-yellow-500
              transform hover:scale-105
              shadow-lg hover:shadow-yellow-500/20"
          >
            <span className={`
              block transition-transform duration-300
              ${isOpen ? 'rotate-180 scale-90' : 'rotate-0 scale-100'}
            `}>
              ☰
            </span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div 
          ref={mobileNavRef}
          className="md:hidden fixed top-16 right-2 bg-black/90 text-white px-4 py-3 z-[60] rounded-lg shadow-lg min-w-fit backdrop-blur-sm animate-fadeIn"
        >
          <ul className="space-y-1">
            {menuItems.map((item, idx) =>
              item.divider ? (
                <hr key={`divider-${idx}`} className="border-white/20 my-2" />
              ) : (
                <li key={idx}>
                  <NavLink
                    to={item.path}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-300 transform hover:translate-x-2 ${
                        isActive
                          ? 'bg-white/20 font-semibold text-yellow-400 shadow-lg'
                          : 'hover:text-yellow-400 hover:bg-white/10'
                      }`
                    }
                  >
                    {item.icon}
                    {item.name}
                  </NavLink>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </>
  );
};

export default Navbar;
