const express = require('express');
const cors = require('cors');
const adminRoutes = require('./routes/admin');
const orderItemsRouter = require('./routes/order-items');
const usersRouter = require('./routes/users');
const salesRoutes = require('./routes/sales');
const productRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const siteSettingsRouter = require('./routes/site-settings');
const authRouter = require('./routes/auth');
const paymentRouter = require('./routes/payment'); // Add this line
const adminAuthRouter = require('./routes/admin/auth'); // เพิ่ม route สำหรับ admin auth
const pageContentsRouter = require('./routes/admin/page-contents');
const pageSectionsRouter = require('./routes/admin/page-sections');
const productTagsRouter = require('./routes/admin/product-tags');
const pageContentRoutes = require('./routes/pageContent');
const navigationItemsRouter = require('./routes/navigation-items');
const giftRoutes = require('./routes/admin/giftRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// เพิ่ม static middleware
app.use('/uploads', express.static('public/uploads'));

// Routes
app.use('/api/order-items', orderItemsRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', productRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/site-settings', siteSettingsRouter);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRouter);
app.use('/api/payment', paymentRouter); // Add this line
app.use('/api/admin/auth', adminAuthRouter); // เพิ่ม route สำหรับ admin auth
app.use('/api/admin/page-contents', pageContentsRouter);
app.use('/api/admin/page-sections', pageSectionsRouter);
app.use('/api/admin/product-tags', productTagsRouter);
app.use('/api', pageContentRoutes);
app.use('/api/navigation-items', navigationItemsRouter);
app.use('/api/admin', giftRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'API is working' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Route not found handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.url} not found`
  });
});

// Export the app
module.exports = app;