const express = require('express');
const {
  getVendorCount
} = require('../controller/secondTorch/secondTorch');

const router = express.Router();

router.get('/secondTorch/vendorCount', getVendorCount);




module.exports = router;