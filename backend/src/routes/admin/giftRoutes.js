const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../../middleware/auth');

// GET: รายการซองอั่งเปาทั้งหมด 
router.get('/gifts', authenticateAdmin, async (req, res) => {
  try {
    const gifts = await prisma.giftCode.findMany({
      include: {
        user: {
          select: {
            username: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    res.json({
      success: true,
      data: gifts.map(gift => ({
        id: gift.id,
        code: gift.code,
        amount: gift.amount,
        status: gift.status,
        user_name: gift.user.username,
        created_at: gift.created_at
      }))
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'ไม่สามารถดึงข้อมูลได้' 
    });
  }
});

// POST: อนุมัติการเติมเงิน
router.post('/gifts/:id/complete', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const gift = await prisma.giftCode.update({
      where: { id: parseInt(id) },
      data: { status: 'completed' },
      include: { user: true }
    });

    // เพิ่มยอดเงินให้ user
    await prisma.user.update({
      where: { id: gift.user.id },
      data: {
        balance: {
          increment: gift.amount
        }
      }
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ไม่สามารถอนุมัติการเติมเงินได้'
    });
  }
});

// POST: ปฏิเสธการเติมเงิน
router.post('/gifts/:id/reject', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.giftCode.update({
      where: { id: parseInt(id) },
      data: { status: 'rejected' }
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ไม่สามารถปฏิเสธการเติมเงินได้'
    });
  }
});

module.exports = router;
