const express = require('express');
const {
  upload,
  uploadData,
  getPartNums,
  exportData,
  getPartNumCounts,
  getCSDistinctPartNumCount,
  getDistinctPartNumCount,
  getESDAgingCounts,
  getSalesOrderNumberCounts,
  getTotalQty
} = require('../controller/shortage/shortageReport');

const router = express.Router();

router.get('/shortage/partnums', getPartNums);
router.get('/shortage/totalqty', getTotalQty);
router.get('/export', exportData);
router.get('/shortage/partnumcounts', getPartNumCounts);
router.get('/shortage/distinctcspartnumcount', getCSDistinctPartNumCount);
router.get('/shortage/distinctpartnumcount', getDistinctPartNumCount);
router.get('/shortage/esdagingcounts', getESDAgingCounts);
router.get('/shortage/salesordernumbercounts', getSalesOrderNumberCounts);
//router.post('/uploadData', upload.single('file'), uploadData);

router.post('/uploadData', upload.single('file'), uploadData); // 更新上传路由



module.exports = router;