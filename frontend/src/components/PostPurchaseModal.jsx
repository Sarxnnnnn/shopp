import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const PostPurchaseModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-[90%] max-w-md"
      >
        <div className="text-center space-y-4">
          <div className="flex items-center gap-2 justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
            <h3 className="text-xl font-semibold">สั่งซื้อสำเร็จ!</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300">คุณต้องการทำอะไรต่อ?</p>
          <div className="flex gap-4 justify-center pt-2">
            <button
              onClick={() => navigate('/order-history')}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              ดูประวัติการสั่งซื้อ
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              ดูสินค้าต่อ
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default PostPurchaseModal
