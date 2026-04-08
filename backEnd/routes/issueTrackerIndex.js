const express = require('express');
const {
  getPqmList,
  getWarRoomList,
  updatePqmEditableFields,
} = require('../controller/issueTracker');

const router = express.Router();

router.get('/issue-tracker/pqm-list', getPqmList);
router.get('/issue-tracker/war-room-list', getWarRoomList);
router.patch('/issue-tracker/pqm-list/:psrNumber', updatePqmEditableFields);

module.exports = router;
