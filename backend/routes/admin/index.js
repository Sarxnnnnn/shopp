const express = require('express');
const router = express.Router();
const adminAuth = require('../../middleware/adminAuth');

// นำเข้า sub-routes
router.use('/settings', require('./settings'));
router.use('/users', require('./users'));
// ...other admin routes...

module.exports = router;
