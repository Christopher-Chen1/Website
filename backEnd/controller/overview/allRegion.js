const { poolPromise } = require('../../config/dbConfig');
const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 600 });

const getReportDate = async (req, res) => {
  try {
    const cacheKey = 'reportDate';
    const cachedData = myCache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    const pool = await poolPromise;
    const result = await pool.request().query('SELECT TOP 1 [Report Date] FROM FT_Realtime_Backlog_global() ORDER BY [Report Date]');
    const data = result.recordset;
    myCache.set(cacheKey, data);

    res.json(data);
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).send('Server error');
  }
};

const getTotalOrderQty = async (req, res) => {
  try {
    const cacheKey = 'totalOrderQty';
    const cachedData = myCache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    const pool = await poolPromise;
    const result = await pool.request().query('SELECT COUNT(DISTINCT [Sales_Order_Num]) AS TotalOrderQTY FROM FT_Realtime_Backlog_global() where [Order Week] IS NOT NULL AND CAST([System Qty] AS float) <> 0');
    const data = result.recordset[0];
    myCache.set(cacheKey, data);

    res.json(data);
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).send('Server error');
  }
};

const getTotalSystemQty = async (req, res) => {
  try {
    const cacheKey = 'totalSystemQty';
    const cachedData = myCache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    const pool = await poolPromise;
    const result = await pool.request().query(`
    SELECT SUM(CAST([System QTY] AS float)) AS TotalSystemQTY
    FROM 
    (
    SELECT [Sales_Order_Num],[System Qty] FROM FT_Realtime_Backlog_global() 
    WHERE [Order Week] IS NOT NULL AND CAST([System Qty] AS float) <> 0
    GROUP BY [Sales_Order_Num],[System Qty]) T`);
    const data = result.recordset[0];
    myCache.set(cacheKey, data);

    res.json(data);
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).send('Server error');
  }
};

const getServiceFeeRev = async (req, res) => {
  try {
    const cacheKey = 'serviceFeeRev';
    const cachedData = myCache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    const pool = await poolPromise;
    const result = await pool.request().query(`
    SELECT SUM(CAST([CFI Svc Fee Rev Disc USD] AS float)) AS ServiceFeeRev
FROM 
(
SELECT [Sales_Order_Num],[Product Line Desc],[CFI Svc Fee Rev Disc USD] FROM FT_Realtime_Backlog_global() 
WHERE [Order Week] IS NOT NULL AND CAST([System Qty] AS float) <> 0
GROUP BY [Sales_Order_Num],[Product Line Desc],[CFI Svc Fee Rev Disc USD]) T
    `);
    const data = result.recordset[0];
    myCache.set(cacheKey, data);

    res.json(data);
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).send('Server error');
  }
};

const getCountryData = async (req, res) => {
  try {
    const cacheKey = 'countryData';
    const cachedData = myCache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        [Country Desc], 
        COUNT(DISTINCT [Sales_Order_Num]) AS TotalValue
      FROM 
        FT_Realtime_Backlog_global()
      WHERE 
        [Order Week] IS NOT NULL AND CAST([System Qty] AS float) <> 0
      GROUP BY 
        [Country Desc];
    `);
    const data = result.recordset;
    myCache.set(cacheKey, data);

    res.json(data);
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).send('Server error');
  }
};

const getRegionData = async (req, res) => {
  try {
    const cacheKey = 'regionData';
    const cachedData = myCache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        [Region Desc], 
        COUNT(DISTINCT [Sales_Order_Num]) AS TotalValue
      FROM 
        FT_Realtime_Backlog_global()
      WHERE 
        [Order Week] IS NOT NULL AND CAST([System Qty] AS float) <> 0
      GROUP BY 
        [Region Desc];
    `);
    const data = result.recordset;
    myCache.set(cacheKey, data);

    res.json(data);
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
    WITH BacklogData AS (
      SELECT 
          [Region Desc], 
          Sales_Order_Num,
          CAST([Initial ESD] AS DATE) AS Initial_ESD_DateOnly,
          DATEDIFF(day, CAST([Initial ESD] AS DATE), GETDATE()) AS DaysDiff
      FROM FT_Realtime_Backlog_global()
      WHERE [Order Week] IS NOT NULL AND CAST([System Qty] AS float) <> 0
  )
  SELECT 
      [Region Desc] AS region, 
      CASE 
          WHEN DaysDiff > 365 THEN '> 365 days'
          WHEN DaysDiff BETWEEN 90 AND 365 THEN '90~365 days'
          WHEN DaysDiff BETWEEN 60 AND 90 THEN '60~90 days'
          WHEN DaysDiff BETWEEN 30 AND 60 THEN '30~60 days'
          WHEN DaysDiff BETWEEN 10 AND 30 THEN '10~30 days'
          WHEN DaysDiff BETWEEN 5 AND 10 THEN '5~10 days'
          WHEN DaysDiff BETWEEN 0 AND 5 THEN '0~5 days'
          WHEN DaysDiff BETWEEN -5 AND 0 THEN '(-5~0 days)'   -- Added for negative range
          WHEN DaysDiff BETWEEN -10 AND -5 THEN '(-10~-5 days)' -- Added for negative range
          WHEN DaysDiff BETWEEN -30 AND -10 THEN '(-30~-10 days)' -- Added for negative range
          WHEN DaysDiff BETWEEN -60 AND -30 THEN '(-60~-30 days)' -- Added for negative range
          WHEN DaysDiff BETWEEN -90 AND -60 THEN '(-90~-60 days)' -- Added for negative range
          WHEN DaysDiff BETWEEN -365 AND -90 THEN '(-365~-90 days)' -- Added for negative range
          WHEN DaysDiff < -365 THEN '< -365 days'  -- Added for days less than -365
          ELSE '(Blank)'
      END AS daysFromTodayCategory,
      COUNT(Sales_Order_Num) AS salesNum
  FROM BacklogData
  GROUP BY 
      [Region Desc], 
      CASE 
          WHEN DaysDiff > 365 THEN '> 365 days'
          WHEN DaysDiff BETWEEN 90 AND 365 THEN '90~365 days'
          WHEN DaysDiff BETWEEN 60 AND 90 THEN '60~90 days'
          WHEN DaysDiff BETWEEN 30 AND 60 THEN '30~60 days'
          WHEN DaysDiff BETWEEN 10 AND 30 THEN '10~30 days'
          WHEN DaysDiff BETWEEN 5 AND 10 THEN '5~10 days'
          WHEN DaysDiff BETWEEN 0 AND 5 THEN '0~5 days'
          WHEN DaysDiff BETWEEN -5 AND 0 THEN '(-5~0 days)'   -- Added for negative range
          WHEN DaysDiff BETWEEN -10 AND -5 THEN '(-10~-5 days)' -- Added for negative range
          WHEN DaysDiff BETWEEN -30 AND -10 THEN '(-30~-10 days)' -- Added for negative range
          WHEN DaysDiff BETWEEN -60 AND -30 THEN '(-60~-30 days)' -- Added for negative range
          WHEN DaysDiff BETWEEN -90 AND -60 THEN '(-90~-60 days)' -- Added for negative range
          WHEN DaysDiff BETWEEN -365 AND -90 THEN '(-365~-90 days)' -- Added for negative range
          WHEN DaysDiff < -365 THEN '< -365 days'  -- Added for days less than -365
          ELSE '(Blank)'
      END;
  
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
    select * from FT_Realtime_Backlog_Global_byStatus()
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
      where [Order Week] IS NOT NULL AND CAST([System Qty] AS float) <> 0
    `);
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
  getRegionData,
  getCustomerData,
  getSelector1,
  getESDRange,
  getOrderStatus,
  getTableData
};
