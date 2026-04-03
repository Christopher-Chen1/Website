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
} = require('../controller/overview/EMEARegion');

const router = express.Router();

// Report Date
router.get('/data/report-date', getReportDate);


router.get('/emea/total-order-qty', getTotalOrderQty);
router.get('/emea/total-system-qty', getTotalSystemQty);
router.get('/emea/service-fee-rev', getServiceFeeRev);

// Country and Customer
router.get('/emea/country-data', getCountryData);
router.get('/emea/customer-data', getCustomerData);
//router.get('/regions/selector1', getSelector1);

// ESD Range
router.get('/emea/esd-range', getESDRange);
router.get('/emea/order-status', getOrderStatus);
router.get('/emea/table-data', getTableData);

module.exports = router;
