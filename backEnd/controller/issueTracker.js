const { poolPromise, sql } = require('../config/dbConfig');

const PQM_TABLE_NAME = process.env.PQM_TABLE_NAME || '[dbo].[PQM_list]';
const WAR_ROOM_VIEW_NAME = process.env.WAR_ROOM_VIEW_NAME || '[dbo].[Viw_war_room_list]';

const SELECT_COLUMNS = [
  '[PSR Number]',
  '[Title]',
  '[Status]',
  '[Workflow]',
  '[PSR Type]',
  '[Factory]',
  '[Failure Category]',
  '[Originator]',
  '[Analyst]',
  '[Date Submitted]',
  '[Date Originated]',
  '[Analyze Date]',
  '[Date Assigned]',
  '[Date Verified]',
  '[Closed Date]',
  '[Final Complete Date]',
  '[Description]',
  '[Disposition Details]',
  '[Technical Root Cause]',
  '[Preventive Action]',
  '[Corrective Action]',
  '[Containment]',
  '[CFI LOB Subset]',
  '[CFI Platform Subset]',
  '[Order Number]',
  '[SI Code-Revision]',
  '[Project Manager]',
  '[Project Engineer]',
  '[Service Tag]',
  '[Failed Phase]',
  '[Responsible]',
  '[Root Cause]',
  '[Impact Order QTY]',
  '[Discretionary Field]',
  '[System QTY (WIP)]',
  '[System QTY (Backlog)]',
  '[Region]',
  '[Customer Name]',
  '[Issue Type]',
  '[war_room_flag]',
  '[SLA]',
  '[Additional Details / Updates]',
  '[Mitigation / Contingency]',
];

const selectClause = SELECT_COLUMNS.join(',\n      ');

const getPqmList = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT ${selectClause}
      FROM ${PQM_TABLE_NAME}
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Failed to fetch PQM list:', err);
    res.status(500).send({ message: err.message });
  }
};

const getWarRoomList = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT ${selectClause}
      FROM ${WAR_ROOM_VIEW_NAME}
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Failed to fetch war room list:', err);
    res.status(500).send({ message: err.message });
  }
};

const normalizeFlag = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const normalized = String(value).trim().toUpperCase();
  if (normalized === 'Y' || normalized === 'N') {
    return normalized;
  }
  return null;
};

const updatePqmEditableFields = async (req, res) => {
  const { psrNumber } = req.params;
  const {
    war_room_flag: warRoomFlagInput,
    additional_details_updates: additionalDetailsUpdates,
    mitigation_contingency: mitigationContingency,
  } = req.body;

  if (!psrNumber) {
    return res.status(400).json({ message: 'PSR Number is required.' });
  }

  const warRoomFlag = normalizeFlag(warRoomFlagInput);

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('psrNumber', sql.NVarChar(255), psrNumber)
      .input('warRoomFlag', sql.NVarChar(10), warRoomFlag)
      .input('additionalDetailsUpdates', sql.NVarChar(sql.MAX), additionalDetailsUpdates || null)
      .input('mitigationContingency', sql.NVarChar(sql.MAX), mitigationContingency || null)
      .query(`
        UPDATE ${PQM_TABLE_NAME}
        SET
          [war_room_flag] = @warRoomFlag,
          [Additional Details / Updates] = @additionalDetailsUpdates,
          [Mitigation / Contingency] = @mitigationContingency
        WHERE [PSR Number] = @psrNumber
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'No record found for this PSR Number.' });
    }

    return res.json({ message: 'Record updated successfully.' });
  } catch (err) {
    console.error('Failed to update PQM record:', err);
    return res.status(500).send({ message: err.message });
  }
};

module.exports = {
  getPqmList,
  getWarRoomList,
  updatePqmEditableFields,
};
