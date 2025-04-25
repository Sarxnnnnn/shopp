import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

const AccountSettingsPage = () => {
  const { user, setUser } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "test@example.com");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const fileInputRef = useRef(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    // Fetch user profile data from API on component mount
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/api/user/profile");
        const { username, email, phone, address, profileImage } = response.data;
        setUsername(username);
        setEmail(email);
        setPhone(phone);
        setAddress(address);
        setProfileImage(profileImage);
      } catch (error) {
        showNotification("ไม่สามารถดึงข้อมูลผู้ใช้ได้", "error");
      }
    };
    fetchUserProfile();
  }, []);

  const handleSave = async () => {
    if (!captchaChecked) {
      showNotification("กรุณายืนยันว่าไม่ใช่บอท", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showNotification("รหัสผ่านไม่ตรงกัน", "error");
      return;
    }

    try {
      const updatedUser = { username, email, phone, address, newPassword };
      await axios.put("/api/user/profile", updatedUser);
      showNotification("บันทึกข้อมูลเรียบร้อยแล้ว", "success");
      // Optionally, update user context after saving
      setUser({ ...user, ...updatedUser });
    } catch (error) {
      showNotification("ไม่สามารถบันทึกข้อมูลได้", "error");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const formData = new FormData();
          formData.append("profileImage", file);
          const response = await axios.post("/api/user/profile-image", formData);
          setProfileImage(response.data.profileImage);
          showNotification("อัปโหลดรูปสำเร็จ", "success");
        } catch (error) {
          showNotification("ไม่สามารถอัปโหลดรูปได้", "error");
        }
      };
      reader.readAsDataURL(file);
    } else {
      showNotification("กรุณาเลือกรูปภาพที่ถูกต้อง", "error");
    }
  };

  const handleRemoveImage = () => {
    setShowConfirmDelete(true);
  };

  const confirmDeleteImage = async () => {
    try {
      await axios.delete("/api/user/profile-image");
      setProfileImage(null);
      setShowConfirmDelete(false);
      showNotification("ลบรูปเรียบร้อยแล้ว", "error");
    } catch (error) {
      showNotification("ไม่สามารถลบรูปได้", "error");
    }
  };

  const cancelDeleteImage = () => {
    setShowConfirmDelete(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 lg:pl-72 bg-background text-foreground flex justify-center items-start">
      <motion.div
        className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 space-y-6"
        {...fadeIn}
      >
        {/* รูปโปรไฟล์ */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-28 h-28 rounded-full border-4 border-border overflow-hidden shadow-md">
            <img
              src={profileImage || "/default-avatar.png"}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex gap-4">
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => fileInputRef.current.click()}
            >
              เปลี่ยนรูป
            </button>
            <button
              className="text-sm text-red-500 hover:underline"
              onClick={handleRemoveImage}
            >
              ลบรูป
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />

          <h2 className="text-2xl font-semibold mt-2">ตั้งค่าบัญชี</h2>
          <p className="text-sm text-muted-foreground">
            สมาชิกตั้งแต่: {user?.memberSince || "—"}
          </p>
        </div>

        {/* ฟอร์มข้อมูล */}
        <motion.div
          className="space-y-4"
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.05 } } }}
        >
          {/* ชื่อผู้ใช้ (แก้ได้) */}
          <motion.div variants={fadeIn}>
            <label className="block mb-1 text-sm font-medium">ชื่อผู้ใช้</label>
            <input
              type="text"
              className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 text-black dark:text-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ชื่อผู้ใช้"
            />
          </motion.div>

          {/* อีเมล (แสดงเฉยๆ) */}
          <motion.div variants={fadeIn}>
            <label className="block mb-1 text-sm font-medium">อีเมล</label>
            <input
              type="email"
              className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 text-black dark:text-white opacity-70 cursor-not-allowed"
              value={email}
              readOnly
            />
          </motion.div>

          {/* เบอร์โทรศัพท์ */}
          <motion.div variants={fadeIn}>
            <label className="block mb-1 text-sm font-medium">เบอร์โทรศัพท์</label>
            <input
              type="text"
              className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 text-black dark:text-white"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="เบอร์โทรศัพท์"
            />
          </motion.div>

          {/* ที่อยู่ */}
          <motion.div variants={fadeIn}>
            <label className="block mb-1 text-sm font-medium">
              ที่อยู่สำหรับจัดส่งสินค้า
            </label>
            <textarea
              className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 text-black dark:text-white"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="ที่อยู่สำหรับจัดส่ง"
              rows={3}
            />
          </motion.div>

          {/* รหัสผ่าน */}
          {[{ label: "รหัสผ่านใหม่", state: newPassword, setState: setNewPassword, show: showPassword, setShow: setShowPassword },
            { label: "ยืนยันรหัสผ่าน", state: confirmPassword, setState: setConfirmPassword, show: showConfirmPassword, setShow: setShowConfirmPassword }
          ].map((field, idx) => (
            <motion.div key={idx} variants={fadeIn}>
              <label className="block mb-1 text-sm font-medium">{field.label}</label>
              <div className="relative">
                <input
                  type={field.show ? "text" : "password"}
                  className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 text-black dark:text-white"
                  value={field.state}
                  onChange={(e) => field.setState(e.target.value)}
                  placeholder={field.label}
                />
                <button
                  type="button"
                  onClick={() => field.setShow(!field.show)}
                  className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-primary"
                >
                  {field.show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>
          ))}

          {/* Captcha */}
          <motion.div className="flex items-center mt-6" variants={fadeIn}>
            <input
              type="checkbox"
              id="captcha"
              className="mr-2"
              checked={captchaChecked}
              onChange={(e) => setCaptchaChecked(e.target.checked)}
            />
            <label htmlFor="captcha" className="text-sm text-muted-foreground">
              ยืนยันว่าคุณไม่ใช่บอท
            </label>
          </motion.div>

          {/* Save Button */}
          <motion.div className="text-center mt-6" variants={fadeIn}>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
            >
              บันทึกข้อมูล
            </button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Modal ลบรูป */}
      <AnimatePresence>
        {showConfirmDelete && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 shadow-2xl w-full max-w-sm text-center border border-border"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-4 text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 mx-auto"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm5 13l-1.41 1.41L12 13.41l-3.59 3.59L7 15l3.59-3.59L7 7.83 8.41 6.41 12 10l3.59-3.59L17 7.83l-3.59 3.58z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">ยืนยันการลบรูปโปรไฟล์</h2>
              <p className="text-sm text-muted-foreground mb-6">
                คุณต้องการลบรูปโปรไฟล์ของคุณใช่หรือไม่? การกระทำนี้ไม่สามารถยกเลิกได้
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={cancelDeleteImage}
                  className="px-5 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm text-black dark:text-white transition"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={confirmDeleteImage}
                  className="px-5 py-2 rounded-md bg-red-600 hover:bg-red-700 text-sm text-white transition"
                >
                  ลบรูป
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccountSettingsPage;
