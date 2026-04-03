const express = require('express');
const {
  getReportDate,
  getTotalOrderQty,
  getTotalSystemQty,
  getServiceFeeRev,
  getCountryData,
  getRegionData,
  getCustomerData,
  getSelector1,
  getESDRange,
  getOrderStatus,
  getTableData
} = require('../controller/overview/allregion');

const router = express.Router();

// Report Date
router.get('/data/report-date', getReportDate);


router.get('/all/total-order-qty', getTotalOrderQty);
router.get('/all/total-system-qty', getTotalSystemQty);
router.get('/all/service-fee-rev', getServiceFeeRev);

// Country and Customer
router.get('/all/country-data', getCountryData);
router.get('/all/region-data', getRegionData);
router.get('/all/customer-data', getCustomerData);
//router.get('/regions/selector1', getSelector1);

// ESD Range
router.get('/all/esd-range', getESDRange);
router.get('/all/order-status', getOrderStatus);
router.get('/all/table-data', getTableData);

module.exports = router;
