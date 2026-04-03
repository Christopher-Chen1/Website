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
} = require('../controller/overview/DAORegion');

const router = express.Router();

// Report Date
router.get('/data/report-date', getReportDate);


router.get('/dao/total-order-qty', getTotalOrderQty);
router.get('/dao/total-system-qty', getTotalSystemQty);
router.get('/dao/service-fee-rev', getServiceFeeRev);

// Country and Customer
router.get('/dao/country-data', getCountryData);
router.get('/dao/customer-data', getCustomerData);
//router.get('/regions/selector1', getSelector1);

// ESD Range
router.get('/dao/esd-range', getESDRange);
router.get('/dao/order-status', getOrderStatus);
router.get('/dao/table-data', getTableData);

module.exports = router;
