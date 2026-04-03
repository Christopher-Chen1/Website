const { poolPromise } = require('../../config/dbConfig');

const getReportDate = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT [Report Date] FROM FT_Realtime_Backlog_global()');
    res.json(result.recordset);
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).send('Server error');
  }
};

const getTotalOrderQty = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`SELECT COUNT(DISTINCT [Sales_Order_Num]) AS TotalOrderQTY FROM FT_Realtime_Backlog_global() WHERE [Region Desc] = 'DAO'`);
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).send('Server error');
  }
};

const getTotalSystemQty = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT SUM(CAST(COALESCE([System Qty], \'0\') AS FLOAT)) AS TotalSystemQTY FROM FT_Realtime_Backlog_global() WHERE [Region Desc] = \'DAO\'');
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).send('Server error');
  }
};

const getServiceFeeRev = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT SUM(CAST(COALESCE([CFI Svc Fee Rev Disc USD], \'0\') AS FLOAT)) AS ServiceFeeRev FROM FT_Realtime_Backlog_global() WHERE [Region Desc] = \'DAO\'');
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).send('Server error');
  }
};

const getCountryData = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
    SELECT 
    [Country Desc], 
    COUNT(DISTINCT [Sales_Order_Num]) AS TotalValue
  FROM 
    FT_Realtime_Backlog_global()
  WHERE [Region Desc] = 'DAO'
  GROUP BY 
    [Country Desc];
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).send('Server error');
  }
};

const getCustomerData = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
    SELECT
ISNULL([Customer Name], 'blank') AS [Customer Name],
[Region Desc], 
COUNT(DISTINCT(Sales_Order_Num)) AS [Backlog] 
FROM 
FT_Realtime_Backlog_global()
WHERE [Region Desc] = 'DAO' 
GROUP BY 
ISNULL([Customer Name], 'blank'), 
[Region Desc] 
ORDER BY 
COUNT(DISTINCT(Sales_Order_Num)) DESC;


    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).send('Server error');
  }
};

const getSelector1 = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT DISTINCT[Region Desc] FROM FT_Realtime_Backlog_global()');
    res.json(result.recordset);
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).send('Server error');
  }
};

const getESDRange = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
    SELECT 
      [Region Desc] AS region, 
      DATEDIFF(day, [Ship By Actual Date], GETDATE()) AS daysFromToday,
      COUNT(Sales_Order_Num) AS salesNum
    FROM FT_Realtime_Backlog_global()
    WHERE [Region Desc] = 'DAO'
    GROUP BY [Region Desc], DATEDIFF(day, [Ship By Actual Date], GETDATE());
  `);
    res.json(result.recordset);
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).send('Server error');
  }
};

const getOrderStatus = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
    SELECT 
      [Region Desc] AS region, 
      [Order Status] AS orderStatus,
      COUNT(Sales_Order_Num) AS salesNum
    FROM FT_Realtime_Backlog_global()
    WHERE [Region Desc] = 'DAO'
    GROUP BY [Region Desc], [Order Status];
  `);
    res.json(result.recordset);
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).send('Server error');
  }
};

const getTableData = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
    SELECT 
    Sales_Order_Num, 
    [System Qty], 
    [SI Number], 
    [BUID Description], 
    [CFI Svc Fee Margin USD], 
    [Build Facility], 
    [2T_Flag], 
    [Country Desc], 
    OFS_CFS_Flag, 
    OFS_CIC_Flag, 
    OFS_CC_Flag, 
    OFS_DESCRIPTION, 
    [Base Customer Name], 
    [Bill to Customer Name], 
    LOB, 
    MABD, 
    [CSWF.CFI PM],
    [Order Year],
    [Order Quarter],
    [Partner Status]
    FROM FT_Realtime_Backlog_global()
    WHERE [Region Desc] = 'DAO';`);
    res.json(result.recordset);
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).send('Server error');
  }
};

module.exports = {
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
};
