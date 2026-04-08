const { poolPromise } = require('../../config/dbConfig');

const ALLOWED_UPDATE_FIELDS = {
  war_room_flag: '[war_room_flag]',
  additional_details_updates: '[Additional Details / Updates]',
  mitigation_contingency: '[Mitigation / Contingency]',
};

const normalizeWarRoomFlag = (value) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const upper = String(value).trim().toUpperCase();
  if (upper !== 'Y' && upper !== 'N') {
    throw new Error('war_room_flag must be Y, N, or null');
  }

  return upper;
};

const getPqmList = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT
        [PSR Number], [Title], [Status], [Workflow], [PSR Type], [Factory], [Failure Category],
        [Originator], [Analyst], [Date Submitted], [Date Originated], [Analyze Date], [Date Assigned],
        [Date Verified], [Closed Date], [Final Complete Date], [Description], [Disposition Details],
        [Technical Root Cause], [Preventive Action], [Corrective Action], [Containment], [CFI LOB Subset],
        [CFI Platform Subset], [Order Number], [SI Code-Revision], [Project Manager], [Project Engineer],
        [Service Tag], [Failed Phase], [Responsible], [Root Cause], [Impact Order QTY],
        [Discretionary Field], [System QTY (WIP)], [System QTY (Backlog)], [Region], [Customer Name],
        [Issue Type], [war_room_flag], [SLA], [Additional Details / Updates], [Mitigation / Contingency]
      FROM [dbo].[PQM_List]
      WHERE [Status] IS NULL OR UPPER(LTRIM(RTRIM([Status]))) <> 'CLOSED'
      ORDER BY [Date Submitted] DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching PQM list:', error);
    res.status(500).json({ error: 'Failed to fetch PQM list' });
  }
};

const getWarRoomList = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM [dbo].[Viw_war_room_list]');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching war room list:', error);
    res.status(500).json({ error: 'Failed to fetch war room list' });
  }
};

const updatePqmEditableFields = async (req, res) => {
  try {
    const { psrNumber } = req.params;
    const {
      war_room_flag: rawWarRoomFlag,
      additional_details_updates: additionalDetails,
      mitigation_contingency: mitigationContingency,
    } = req.body;

    if (!psrNumber) {
      return res.status(400).json({ error: 'psrNumber is required' });
    }

    const updates = [];
    const pool = await poolPromise;
    const request = pool.request();

    if (Object.prototype.hasOwnProperty.call(req.body, 'war_room_flag')) {
      const normalizedWarRoomFlag = normalizeWarRoomFlag(rawWarRoomFlag);
      updates.push(`${ALLOWED_UPDATE_FIELDS.war_room_flag} = @war_room_flag`);
      request.input('war_room_flag', normalizedWarRoomFlag);
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'additional_details_updates')) {
      updates.push(`${ALLOWED_UPDATE_FIELDS.additional_details_updates} = @additional_details_updates`);
      request.input('additional_details_updates', additionalDetails === '' ? null : additionalDetails ?? null);
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'mitigation_contingency')) {
      updates.push(`${ALLOWED_UPDATE_FIELDS.mitigation_contingency} = @mitigation_contingency`);
      request.input('mitigation_contingency', mitigationContingency === '' ? null : mitigationContingency ?? null);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No editable fields provided' });
    }

    request.input('psr_number', psrNumber);

    await request.query(`
      UPDATE [dbo].[PQM_List]
      SET ${updates.join(', ')}
      WHERE [PSR Number] = @psr_number
    `);

    return res.json({ message: 'Record updated successfully' });
  } catch (error) {
    console.error('Error updating PQM record:', error);
    return res.status(500).json({ error: error.message || 'Failed to update PQM record' });
  }
};

module.exports = {
  getPqmList,
  getWarRoomList,
  updatePqmEditableFields,
};
