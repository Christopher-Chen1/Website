const express = require('express');

const {
  getPqmList,
  getWarRoomList,
  updatePqmEditableFields,
} = require('../controller/issueTracker/issueTracker');

const router = express.Router();

router.get('/pqm-list', getPqmList);
router.get('/war-room-list', getWarRoomList);
router.patch('/pqm-list/:psrNumber', updatePqmEditableFields);

module.exports = router;
