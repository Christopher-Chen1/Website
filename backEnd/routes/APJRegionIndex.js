const express = require('express');
const {
  getReportDate,
  getTotalOrderQty,
  getTotalSystemQty,
  getServiceFeeRev,
  getCountryData,
  getCustomerData,
  getSelector1,
  getESDRange,
  getOrderStatus,
  getTableData
} = require('../controller/overview/APJRegion');

const router = express.Router();

// Report Date
router.get('/data/report-date', getReportDate);


router.get('/apj/total-order-qty', getTotalOrderQty);
router.get('/apj/total-system-qty', getTotalSystemQty);
router.get('/apj/service-fee-rev', getServiceFeeRev);

// Country and Customer
router.get('/apj/country-data', getCountryData);
router.get('/apj/customer-data', getCustomerData);
//router.get('/regions/selector1', getSelector1);

// ESD Range
router.get('/apj/esd-range', getESDRange);
router.get('/apj/order-status', getOrderStatus);
router.get('/apj/table-data', getTableData);

module.exports = router;
