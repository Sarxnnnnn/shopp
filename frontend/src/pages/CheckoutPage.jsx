import React, { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useNotification } from "../contexts/NotificationContext";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AccountEditModal from "../components/AccountEditModal";

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const { showNotification } = useNotification();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [isLoading, setIsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [qr, setQr] = useState(null);
  const [ref, setRef] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const total = cartItems.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return acc + price * quantity;
  }, 0);

  const isUserInfoComplete =
    !!user?.fullName?.trim() && !!user?.address?.trim() && !!user?.phone?.trim();

  const generateQR = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/payment/promptpay", {
        amount: total.toFixed(2),
      });
      setQr(res.data.qr);
      setRef(res.data.ref);
    } catch (error) {
      showNotification("ไม่สามารถสร้าง QR Code ได้", "error");
    }
  };

  const saveOrder = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/orders", {
        userId: user.id,
        totalPrice: total,
        promptpayRef: ref,
        cartItems,
        paymentMethod,
      });
      setOrderId(res.data.orderId);
    } catch (error) {
      showNotification("เกิดข้อผิดพลาดในการบันทึกคำสั่งซื้อ", "error");
    }
  };

  useEffect(() => {
    if (paymentMethod === "mobile_banking") {
      generateQR();
    }
  }, [paymentMethod]);

  useEffect(() => {
    if (ref && user) {
      saveOrder();
    }
  }, [ref, user]);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showNotification("ไม่มีสินค้าในตะกร้า", "error");
      return;
    }

    if (!isUserInfoComplete) {
      showNotification("กรุณากรอกชื่อ ที่อยู่ และเบอร์โทรในบัญชีก่อนชำระเงิน", "error");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showNotification("ดำเนินการชำระเงินสำเร็จ", "success");
      clearCart();
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 lg:pl-72 bg-background text-foreground transition-colors">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.h1
          className="text-3xl font-bold text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ชำระเงิน
        </motion.h1>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 space-y-6 transition-colors">
          {/* รายการสินค้า */}
          <section>
            <h2 className="text-xl font-semibold mb-2">รายการสินค้า</h2>
            {cartItems.length === 0 ? (
              <p className="text-muted-foreground">ไม่มีสินค้าในตะกร้า</p>
            ) : (
              <ul className="divide-y divide-border">
                {cartItems.map((item, index) => {
                  const price = Number(item.price) || 0;
                  const quantity = Number(item.quantity) || 1;
                  const subtotal = price * quantity;

                  return (
                    <li
                      key={item.id || index}
                      className="py-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-xl"
                        />
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            ฿{price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                            })}{" "}
                            x {quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-right font-semibold text-blue-600">
                        ฿{subtotal.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* ข้อมูลผู้รับ */}
          <section className="border p-4 rounded-xl bg-gray-100 dark:bg-gray-900 transition-colors">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">ข้อมูลผู้รับสินค้า</h2>
              <button
                onClick={() => setShowEditModal(true)}
                className="text-sm text-blue-600 hover:underline"
              >
                แก้ไขข้อมูล
              </button>
            </div>
            <p>
              <strong>ชื่อ:</strong>{" "}
              {user?.fullName || (
                <span className="text-red-500">- ยังไม่กรอก -</span>
              )}
            </p>
            <p>
              <strong>ที่อยู่:</strong>{" "}
              {user?.address || (
                <span className="text-red-500">- ยังไม่กรอก -</span>
              )}
            </p>
            <p>
              <strong>เบอร์โทร:</strong>{" "}
              {user?.phone || (
                <span className="text-red-500">- ยังไม่กรอก -</span>
              )}
            </p>
          </section>

          {/* วิธีชำระเงิน */}
          <section>
            <h2 className="text-xl font-semibold mb-3">วิธีชำระเงิน</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { value: "credit_card", label: "บัตรเครดิต / เดบิต" },
                { value: "bank_transfer", label: "โอนผ่านธนาคาร" },
                { value: "cod", label: "เก็บเงินปลายทาง" },
                {
                  value: "mobile_banking",
                  label: "Mobile Banking / QR Code",
                },
              ].map(({ value, label }) => (
                <label
                  key={value}
                  className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition hover:bg-accent/50 ${
                    paymentMethod === value ? "ring-2 ring-green-500" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={value}
                    checked={paymentMethod === value}
                    onChange={() => setPaymentMethod(value)}
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* QR Code Section */}
          {paymentMethod === "mobile_banking" && qr && (
            <section className="text-center">
              <h3 className="text-lg font-semibold mt-4 mb-2">
                ชำระเงินผ่าน QR Code
              </h3>
              <img
                src={qr}
                alt="QR Code"
                className="w-48 h-48 mx-auto rounded-lg shadow-lg border dark:border-gray-600"
              />
              <p className="text-sm text-muted-foreground mt-2">
                สแกน QR เพื่อชำระเงิน
              </p>
              {orderId && (
                <p className="mt-2 text-green-500 text-sm">
                  🧾 หมายเลขคำสั่งซื้อ: {orderId}
                </p>
              )}
            </section>
          )}

          {/* รวมทั้งหมด */}
          <section className="flex justify-between items-center pt-4 border-t dark:border-gray-700">
            <p className="text-lg font-semibold">รวมทั้งหมด</p>
            <p className="text-xl font-bold text-green-600">
              ฿{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </section>

          {/* ปุ่มยืนยัน */}
          <div className="text-center mt-6">
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="relative px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg transition duration-200 disabled:opacity-60"
            >
              {isLoading ? (
                <span className="flex justify-center items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                    ></path>
                  </svg>
                  กำลังดำเนินการ...
                </span>
              ) : (
                "ยืนยันการชำระเงิน"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal แก้ไขข้อมูลบัญชี */}
      {showEditModal && <AccountEditModal onClose={() => setShowEditModal(false)} />}
    </div>
  );
};

export default CheckoutPage;
