// src/components/Navbar.jsx
import { useContext, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome, FaEnvelope, FaFileContract, FaShieldAlt,
} from 'react-icons/fa';
import { LiaWindowRestore } from 'react-icons/lia';
import { MdFiberNew } from 'react-icons/md';
import { TbChartBar } from 'react-icons/tb';
import { FiShoppingCart, FiSettings, FiLogOut } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import { CartContext } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const accountMenuRef = useRef(null);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  };

  const goToAccountSettings = () => {
    navigate('/account-settings');
    setShowAccountMenu(false);
  };

  const toggleAccountMenu = () => setShowAccountMenu((prev) => !prev);

  const handleLogout = () => {
    logout();
    setPopupMessage('ออกจากระบบแล้ว');
    setShowAccountMenu(false);
    navigate('/');
  };

  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  useEffect(() => {
    if (user) setPopupMessage('เข้าสู่ระบบสำเร็จ!');
  }, [user]);

  useEffect(() => {
    if (!popupMessage) return;
    const timer = setTimeout(() => setPopupMessage(''), 3000);
    return () => clearTimeout(timer);
  }, [popupMessage]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const authButtonStyle = (path) =>
    `px-3 py-1 rounded border transition text-sm ${
      location.pathname === path
        ? 'bg-yellow-400 text-black'
        : 'hover:bg-gray-700 border-white'
    }`;

  const iconButtonStyle =
    'relative flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 transition text-sm';

  const navItems = [
    { name: 'หน้าหลัก', icon: <FaHome />, path: '/' },
    { name: 'สินค้าทั่วไป', icon: <LiaWindowRestore />, path: '/normalproduct' },
    { name: 'สินค้าใหม่', icon: <MdFiberNew />, path: '/newproduct' },
    { name: 'สินค้าขายดี', icon: <TbChartBar />, path: '/popularproduct' },
    { divider: true },
    { name: 'ช่องทางการติดต่อ', icon: <FaEnvelope />, path: '/contact' },
    { name: 'เงื่อนไขการให้บริการ', icon: <FaFileContract />, path: '/terms' },
    { name: 'นโยบายความเป็นส่วนตัว', icon: <FaShieldAlt />, path: '/privacy' },
  ];

  const avatarUrl = user?.avatar || 'https://via.placeholder.com/40';

  return (
    <>
      {/* ✅ Popup */}
      {popupMessage && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow z-50 transition-opacity duration-300 animate-fade-in-out">
          {popupMessage}
        </div>
      )}

      {/* ✅ Desktop Topbar */}
      <div className="hidden md:flex fixed top-0 right-0 w-[calc(100%-15rem)] justify-end bg-black text-white p-4 z-40">
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          {!user ? (
            <>
              <Link to="/login" className={authButtonStyle('/login')}>เข้าสู่ระบบ</Link>
              <Link to="/register" className={authButtonStyle('/register')}>สมัครสมาชิก</Link>
            </>
          ) : (
            <>
              <Link to="/cart" onClick={handleNavClick} className={`${iconButtonStyle} hover:bg-blue-500`}>
                <FiShoppingCart className="text-lg" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
                ตะกร้าสินค้า
              </Link>
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-9 h-9 rounded-full cursor-pointer hover:ring-2 ring-white"
                onClick={toggleAccountMenu}
              />
            </>
          )}
        </div>
      </div>

      {/* ✅ Desktop Sidebar */}
      <nav className="hidden md:flex flex-col fixed top-0 left-0 h-full w-60 bg-black text-white p-6 z-50">
        <h1 className="text-2xl font-bold mb-10">SARXNNN SHOP</h1>
        <div className="space-y-1 mt-10">
          {navItems.map((item, idx) =>
            item.divider ? (
              <div key={`divider-${idx}`} className="border-t border-white/20 my-3" />
            ) : (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md transition ${
                    isActive ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            )
          )}
        </div>
      </nav>

      {/* ✅ Mobile Topbar */}
      <div className="md:hidden fixed top-0 w-full bg-black text-white p-4 flex justify-between items-center z-50">
        <h1 className="text-xl font-bold">SARXNNN SHOP</h1>
        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Link to="/login" className={authButtonStyle('/login')}>เข้าสู่ระบบ</Link>
              <Link to="/register" className={authButtonStyle('/register')}>สมัครสมาชิก</Link>
            </>
          ) : (
            <>
              <Link to="/cart" onClick={handleNavClick} className="relative p-2 rounded-full hover:bg-yellow-500 hover:text-black transition">
                <FiShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-9 h-9 rounded-full cursor-pointer hover:ring-2 ring-white"
                onClick={toggleAccountMenu}
              />
            </>
          )}
          <ThemeToggle />
          <button onClick={handleToggle} className="focus:outline-none text-xl">☰</button>
        </div>
      </div>

      {/* ✅ Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed top-16 right-2 bg-black/70 text-white px-4 py-3 z-40 rounded-lg shadow-lg min-w-fit backdrop-blur-sm">
          <ul className="space-y-1">
            {navItems.map((item, idx) =>
              item.divider ? (
                <hr key={`divider-${idx}`} className="border-white/20 my-2" />
              ) : (
                <li key={idx}>
                  <NavLink
                    to={item.path}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-md transition ${
                        isActive ? 'bg-white/20 font-semibold' : 'hover:text-yellow-400'
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

      {/* ✅ Account Menu */}
      {showAccountMenu && user && (
        <div ref={accountMenuRef} className="fixed top-24 right-4 bg-white text-black p-4 shadow-lg rounded-md z-50 w-72 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <img src={avatarUrl} alt="avatar" className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-semibold">{user.name || 'บัญชีของคุณ'}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            <p><span className="font-semibold text-black">สมัครเมื่อ:</span> {user.memberSince || '1 ม.ค. 2024'}</p>
            <p><span className="font-semibold text-black">ที่อยู่:</span> {user.address || 'ยังไม่ระบุที่อยู่'}</p>
          </div>
          <div className="mt-4 space-y-2">
            <button onClick={goToAccountSettings} className="flex items-center gap-2 w-full text-left hover:text-blue-600">
              <FiSettings /> ตั้งค่าบัญชี
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left text-red-500 hover:text-red-700">
              <FiLogOut /> ออกจากระบบ
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
