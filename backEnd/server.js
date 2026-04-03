const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const app = express();
const port = 3000;

app.disable('x-powered-by');

// 启用 CORS
app.use(cors());

// SQL Server 配置
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// 连接到数据库
sql.connect(config).then(pool => {
  if (pool.connected) {
    console.log('Connected to SQL Server');
  }

  // API 端点获取报告日期
  app.get('/api/data', async (req, res) => {
    try {
      const result = await pool.request().query('SELECT [Report Date] FROM FT_Realtime_Backlog_global()');
      res.json(result.recordset);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });
  //all region
  //total order qty
  app.get('/api/total-order-qty', async (req, res) => {
    try {
      const result = await pool.request().query('SELECT COUNT(DISTINCT [Sales_Order_Num]) AS TotalOrderQTY FROM FT_Realtime_Backlog_global()');
      res.json(result.recordset[0]);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });
  //total system qty
  app.get('/api/total-system-qty', async (req, res) => {
    try {
      const result = await pool.request().query('SELECT SUM(CAST(COALESCE([System Qty], \'0\') AS FLOAT)) AS TotalSystemQTY FROM FT_Realtime_Backlog_global()');
      res.json(result.recordset[0]);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });
  //service fee rev
  app.get('/api/service-fee-rev', async (req, res) => {
    try {
      const result = await pool.request().query('SELECT SUM(CAST(COALESCE([CFI Svc Fee Rev Disc USD], \'0\') AS FLOAT)) AS ServiceFeeRev FROM FT_Realtime_Backlog_global()');
      res.json(result.recordset[0]);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });
  // 获取各个地区的数据
  app.get('/api/region-data', async (req, res) => {
    try {
      const result = await pool.request().query(`
      SELECT 
      [Country Desc], 
      COUNT(DISTINCT [Sales_Order_Num]) AS TotalValue
    FROM 
      FT_Realtime_Backlog_global()
    GROUP BY 
      [Country Desc];
      `);
      res.json(result.recordset);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });
  //公司
  app.get('/api/region-data1', async (req, res) => {
    try {
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
  });
  //选择器
  app.get('/api/selector1', async (req, res) => {
    try {
      const result = await pool.request().query('SELECT DISTINCT[Region Desc] FROM FT_Realtime_Backlog_global()');
      res.json(result.recordset);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });


  // 定义一个获取销售数据的 API 路由
  app.get('/api/sales-data', async (req, res) => {
    try {
      const result = await pool.request().query(`
        SELECT 
          [Region Desc] AS region, 
          DATEDIFF(day, [Ship By Actual Date], GETDATE()) AS daysFromToday,
          COUNT(Sales_Order_Num) AS salesNum
        FROM FT_Realtime_Backlog_global()
        GROUP BY [Region Desc], DATEDIFF(day, [Ship By Actual Date], GETDATE());
      `);
      res.json(result.recordset);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });

  //定义一个获取状态数据的路由
  app.get('/api/order-data', async (req, res) => {
    try {
      const result = await pool.request().query(`
        SELECT 
          [Region Desc] AS region, 
          [Order Status] AS orderStatus,
          COUNT(Sales_Order_Num) AS salesNum
        FROM FT_Realtime_Backlog_global()
        GROUP BY [Region Desc], [Order Status];
      `);
      res.json(result.recordset);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });

  //表格获取数据
  app.get('/api/table-data', async (req, res) => {
    try {
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
      FROM FT_Realtime_Backlog_global()`);
      res.json(result.recordset);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });

  //apj region
  //total order qty
  app.get('/api/total-order-qty-apj', async (req, res) => {
    try {
      const result = await pool.request().query(`SELECT COUNT(DISTINCT [Sales_Order_Num]) AS TotalOrderQTY FROM FT_Realtime_Backlog_global() WHERE [Region Desc] = 'APJ'`);
      res.json(result.recordset[0]);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });
  //total system qty
  app.get('/api/total-system-qty-apj', async (req, res) => {
    try {
      const result = await pool.request().query('SELECT SUM(CAST(COALESCE([System Qty], \'0\') AS FLOAT)) AS TotalSystemQTY FROM FT_Realtime_Backlog_global() WHERE [Region Desc] = \'APJ\'');
      res.json(result.recordset[0]);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });
  //service fee rev
  app.get('/api/service-fee-rev-apj', async (req, res) => {
    try {
      const result = await pool.request().query('SELECT SUM(CAST(COALESCE([CFI Svc Fee Rev Disc USD], \'0\') AS FLOAT)) AS ServiceFeeRev FROM FT_Realtime_Backlog_global() WHERE [Region Desc] = \'APJ\'');
      res.json(result.recordset[0]);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });
  // 获取各个地区的数据
  app.get('/api/region-data-apj', async (req, res) => {
    try {
      const result = await pool.request().query(`
      SELECT 
      [Country Desc], 
      COUNT(DISTINCT [Sales_Order_Num]) AS TotalValue
    FROM 
      FT_Realtime_Backlog_global()
    WHERE [Region Desc] = 'APJ'
    GROUP BY 
      [Country Desc];
      `);
      res.json(result.recordset);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });

  //公司
  app.get('/api/region-data1-apj', async (req, res) => {
    try {
      const result = await pool.request().query(`
      SELECT
  ISNULL([Customer Name], 'blank') AS [Customer Name],
  [Region Desc], 
  COUNT(DISTINCT(Sales_Order_Num)) AS [Backlog] 
FROM 
  FT_Realtime_Backlog_global()
  WHERE [Region Desc] = 'APJ' 
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
  });

  // 定义一个获取销售数据的 API 路由
  app.get('/api/sales-data-apj', async (req, res) => {
    try {
      const result = await pool.request().query(`
        SELECT 
          [Region Desc] AS region, 
          DATEDIFF(day, [Ship By Actual Date], GETDATE()) AS daysFromToday,
          COUNT(Sales_Order_Num) AS salesNum
        FROM FT_Realtime_Backlog_global()
        WHERE [Region Desc] = 'APJ'
        GROUP BY [Region Desc], DATEDIFF(day, [Ship By Actual Date], GETDATE());
      `);
      res.json(result.recordset);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });

  //定义一个获取状态数据的路由
  app.get('/api/order-data-apj', async (req, res) => {
    try {
      const result = await pool.request().query(`
        SELECT 
          [Region Desc] AS region, 
          [Order Status] AS orderStatus,
          COUNT(Sales_Order_Num) AS salesNum
        FROM FT_Realtime_Backlog_global()
        WHERE [Region Desc] = 'APJ'
        GROUP BY [Region Desc], [Order Status];
      `);
      res.json(result.recordset);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });

  //表格获取数据
  app.get('/api/table-data-apj', async (req, res) => {
    try {
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
      WHERE [Region Desc] = 'APJ';`);
      res.json(result.recordset);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });

  //apjn region
  //total order qty
  app.get('/api/total-order-qty-apjn', async (req, res) => {
    try {
      const result = await pool.request().query(`
        SELECT 
          COUNT(DISTINCT [Sales_Order_Num]) AS TotalOrderQTY 
        FROM FT_Realtime_Backlog_global()
        WHERE [Region Desc] = 'APJ' 
          AND [Country Desc] IN ('China', 'Hong Kong', 'Taiwan', 'Japan', 'Korea')
      `);
      res.json(result.recordset[0]);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });
  
  
  //total system qty
  app.get('/api/total-system-qty-apjn', async (req, res) => {
    try {
      const result = await pool.request().query(`
        SELECT SUM(CAST(COALESCE([System Qty], '0') AS FLOAT)) AS TotalSystemQTY 
        FROM FT_Realtime_Backlog_global()
        WHERE [Region Desc] = 'APJ' 
          AND [Country Desc] IN ('China', 'Hong Kong', 'Taiwan', 'Japan', 'Korea')
      `);
      res.json(result.recordset[0]);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });
  
  //service fee rev
  app.get('/api/service-fee-rev-apjn', async (req, res) => {
    try {
      const result = await pool.request().query(`
        SELECT SUM(CAST(COALESCE([CFI Svc Fee Rev Disc USD], '0') AS FLOAT)) AS ServiceFeeRev 
        FROM FT_Realtime_Backlog_global()
        WHERE [Region Desc] = 'APJ' 
          AND [Country Desc] IN ('China', 'Hong Kong', 'Taiwan', 'Japan', 'Korea')
      `);
      res.json(result.recordset[0]);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });
  
  // 获取各个地区的数据
  app.get('/api/region-data-apjn', async (req, res) => {
    try {
      const result = await pool.request().query(`
        SELECT 
          [Country Desc], 
          COUNT(DISTINCT [Sales_Order_Num]) AS TotalValue
        FROM 
          FT_Realtime_Backlog_global()
        WHERE 
          [Region Desc] = 'APJ' 
          AND [Country Desc] IN ('China', 'Hong Kong', 'Taiwan', 'Japan', 'Korea')
        GROUP BY 
          [Country Desc];
      `);
      res.json(result.recordset);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });
  

  //公司
  app.get('/api/region-data1-apjn', async (req, res) => {
    try {
      const result = await pool.request().query(`
        SELECT
          ISNULL([Customer Name], 'blank') AS [Customer Name],
          REPLACE([Region Desc], 'APJ', 'APJN') AS [Region Desc], 
          COUNT(DISTINCT(Sales_Order_Num)) AS [Backlog] 
        FROM 
          FT_Realtime_Backlog_global()
        WHERE 
          [Region Desc] = 'APJ' 
          AND [Country Desc] IN ('China', 'Hong Kong', 'Taiwan', 'Japan', 'Korea')
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
  });
  
  

  // 定义一个获取销售数据的 API 路由
  app.get('/api/sales-data-apjn', async (req, res) => {
    try {
      const result = await pool.request().query(`
        SELECT 
          'APJN' AS region, 
          DATEDIFF(day, [Ship By Actual Date], GETDATE()) AS daysFromToday,
          COUNT(Sales_Order_Num) AS salesNum
        FROM FT_Realtime_Backlog_global()
        WHERE [Region Desc] = 'APJ'
          AND [Country Desc] IN ('China', 'Hong Kong', 'Taiwan', 'Japan', 'Korea')
        GROUP BY DATEDIFF(day, [Ship By Actual Date], GETDATE());
      `);
      res.json(result.recordset);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });
  

  //定义一个获取状态数据的路由
  app.get('/api/order-data-apjn', async (req, res) => {
    try {
      const result = await pool.request().query(`
        SELECT 
          'APJN' AS region, 
          [Order Status] AS orderStatus,
          COUNT(Sales_Order_Num) AS salesNum
        FROM FT_Realtime_Backlog_global()
        WHERE [Region Desc] = 'APJ'
          AND [Country Desc] IN ('China', 'Hong Kong', 'Taiwan', 'Japan', 'Korea')
        GROUP BY [Order Status];
      `);
      res.json(result.recordset);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });
  

  //表格获取数据
  app.get('/api/table-data-apjn', async (req, res) => {
    try {
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
        WHERE [Region Desc] = 'APJ'
          AND [Country Desc] IN ('China', 'Hong Kong', 'Taiwan', 'Japan', 'Korea');
      `);
      res.json(result.recordset);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });

  //apjs region
  //total order qty
  app.get('/api/total-order-qty-apjs', async (req, res) => {
    try {
      const result = await pool.request().query(`
        SELECT COUNT(DISTINCT [Sales_Order_Num]) AS TotalOrderQTY 
        FROM FT_Realtime_Backlog_global() 
        WHERE [Region Desc] = 'APJ'
          AND [Country Desc] NOT IN ('China', 'Hong Kong', 'Taiwan', 'Japan', 'Korea');
      `);
      res.json(result.recordset[0]);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });
  
  //total system qty
  app.get('/api/total-system-qty-apjs', async (req, res) => {
    try {
      const result = await pool.request().query(`
        SELECT SUM(CAST(COALESCE([System Qty], '0') AS FLOAT)) AS TotalSystemQTY 
        FROM FT_Realtime_Backlog_global() 
        WHERE [Region Desc] = 'APJ'
          AND [Country Desc] NOT IN ('China', 'Hong Kong', 'Taiwan', 'Japan', 'Korea');
      `);
      res.json(result.recordset[0]);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });
  
  //service fee rev
  app.get('/api/service-fee-rev-apjs', async (req, res) => {
    try {
      const result = await pool.request().query(`
        SELECT SUM(CAST(COALESCE([CFI Svc Fee Rev Disc USD], '0') AS FLOAT)) AS ServiceFeeRev 
        FROM FT_Realtime_Backlog_global() 
        WHERE [Region Desc] = 'APJ'
          AND [Country Desc] NOT IN ('China', 'Hong Kong', 'Taiwan', 'Japan', 'Korea');
      `);
      res.json(result.recordset[0]);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });
  
  // 获取各个地区的数据
  app.get('/api/region-data-apjs', async (req, res) => {
    try {
      const result = await pool.request().query(`
        SELECT 
          [Country Desc], 
          COUNT(DISTINCT [Sales_Order_Num]) AS TotalValue
        FROM 
          FT_Realtime_Backlog_global()
        WHERE [Region Desc] = 'APJ'
          AND [Country Desc] NOT IN ('China', 'Hong Kong', 'Taiwan', 'Japan', 'Korea')
        GROUP BY 
          [Country Desc];
      `);
      res.json(result.recordset);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });
  

  //公司
  app.get('/api/region-data1-apjs', async (req, res) => {
    try {
      const result = await pool.request().query(`
        SELECT
        ISNULL([Customer Name], 'blank') AS [Customer Name],
        REPLACE([Region Desc], 'APJ', 'APJS') AS [Region Desc], 
        COUNT(DISTINCT(Sales_Order_Num)) AS [Backlog] 
        FROM 
          FT_Realtime_Backlog_global()
        WHERE 
          [Region Desc] = 'APJ' 
          AND [Country Desc] NOT IN ('China', 'Hong Kong', 'Taiwan', 'Japan', 'Korea')
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
  });
  

  // 定义一个获取销售数据的 API 路由
  app.get('/api/sales-data-apjs', async (req, res) => {
    try {
      const result = await pool.request().query(`
      SELECT 
      'APJS' AS region, 
      DATEDIFF(day, [Ship By Actual Date], GETDATE()) AS daysFromToday,
      COUNT(Sales_Order_Num) AS salesNum
    FROM FT_Realtime_Backlog_global()
    WHERE [Region Desc] = 'APJ'
      AND [Country Desc] NOT IN ('China', 'Hong Kong', 'Taiwan', 'Japan', 'Korea')
    GROUP BY DATEDIFF(day, [Ship By Actual Date], GETDATE());
      `);
      res.json(result.recordset);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });
  

  //定义一个获取状态数据的路由
  app.get('/api/order-data-apjs', async (req, res) => {
    try {
      const result = await pool.request().query(`
        SELECT 
          'APJS' AS region, 
          [Order Status] AS orderStatus,
          COUNT(Sales_Order_Num) AS salesNum
        FROM FT_Realtime_Backlog_global()
        WHERE [Region Desc] = 'APJ'
          AND [Country Desc] NOT IN ('China', 'Hong Kong', 'Taiwan', 'Japan', 'Korea')
        GROUP BY [Order Status];
      `);
      res.json(result.recordset);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });

  //表格获取数据
  app.get('/api/table-data-apjs', async (req, res) => {
    try {
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
        WHERE [Region Desc] = 'APJ'
          AND [Country Desc] NOT IN ('China', 'Hong Kong', 'Taiwan', 'Japan', 'Korea');
      `);
      res.json(result.recordset);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });
  

  //dao region
  //total order qty
  app.get('/api/total-order-qty-dao', async (req, res) => {
    try {
      const result = await pool.request().query(`SELECT COUNT(DISTINCT [Sales_Order_Num]) AS TotalOrderQTY FROM FT_Realtime_Backlog_global() WHERE [Region Desc] = 'DAO'`);
      res.json(result.recordset[0]);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });
  //total system qty
  app.get('/api/total-system-qty-dao', async (req, res) => {
    try {
      const result = await pool.request().query('SELECT SUM(CAST(COALESCE([System Qty], \'0\') AS FLOAT)) AS TotalSystemQTY FROM FT_Realtime_Backlog_global() WHERE [Region Desc] = \'DAO\'');
      res.json(result.recordset[0]);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });
  //service fee rev
  app.get('/api/service-fee-rev-dao', async (req, res) => {
    try {
      const result = await pool.request().query('SELECT SUM(CAST(COALESCE([CFI Svc Fee Rev Disc USD], \'0\') AS FLOAT)) AS ServiceFeeRev FROM FT_Realtime_Backlog_global() WHERE [Region Desc] = \'DAO\'');
      res.json(result.recordset[0]);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });
  // 获取各个地区的数据
  app.get('/api/region-data-dao', async (req, res) => {
    try {
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
  });

  //公司
  app.get('/api/region-data1-dao', async (req, res) => {
    try {
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
  });

  // 定义一个获取销售数据的 API 路由
  app.get('/api/sales-data-dao', async (req, res) => {
    try {
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
  });

  //定义一个获取状态数据的路由
  app.get('/api/order-data-dao', async (req, res) => {
    try {
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
  });

  //表格获取数据
  app.get('/api/table-data-dao', async (req, res) => {
    try {
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
  });

  //emea region
  //total order qty
  app.get('/api/total-order-qty-emea', async (req, res) => {
    try {
      const result = await pool.request().query(`SELECT COUNT(DISTINCT [Sales_Order_Num]) AS TotalOrderQTY FROM FT_Realtime_Backlog_global() WHERE [Region Desc] = 'EMEA'`);
      res.json(result.recordset[0]);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });
  //total system qty
  app.get('/api/total-system-qty-emea', async (req, res) => {
    try {
      const result = await pool.request().query('SELECT SUM(CAST(COALESCE([System Qty], \'0\') AS FLOAT)) AS TotalSystemQTY FROM FT_Realtime_Backlog_global() WHERE [Region Desc] = \'EMEA\'');
      res.json(result.recordset[0]);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });
  //service fee rev
  app.get('/api/service-fee-rev-emea', async (req, res) => {
    try {
      const result = await pool.request().query('SELECT SUM(CAST(COALESCE([CFI Svc Fee Rev Disc USD], \'0\') AS FLOAT)) AS ServiceFeeRev FROM FT_Realtime_Backlog_global() WHERE [Region Desc] = \'emea\'');
      res.json(result.recordset[0]);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });
  // 获取各个地区的数据
  app.get('/api/region-data-emea', async (req, res) => {
    try {
      const result = await pool.request().query(`
      SELECT 
      [Country Desc], 
      COUNT(DISTINCT [Sales_Order_Num]) AS TotalValue
    FROM 
      FT_Realtime_Backlog_global()
    WHERE [Region Desc] = 'EMEA'
    GROUP BY 
      [Country Desc];
      `);
      res.json(result.recordset);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });

  //公司
  app.get('/api/region-data1-emea', async (req, res) => {
    try {
      const result = await pool.request().query(`
      SELECT
  ISNULL([Customer Name], 'blank') AS [Customer Name],
  [Region Desc], 
  COUNT(DISTINCT(Sales_Order_Num)) AS [Backlog] 
FROM 
  FT_Realtime_Backlog_global()
  WHERE [Region Desc] = 'EMEA' 
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
  });

  // 定义一个获取销售数据的 API 路由
  app.get('/api/sales-data-emea', async (req, res) => {
    try {
      const result = await pool.request().query(`
        SELECT 
          [Region Desc] AS region, 
          DATEDIFF(day, [Ship By Actual Date], GETDATE()) AS daysFromToday,
          COUNT(Sales_Order_Num) AS salesNum
        FROM FT_Realtime_Backlog_global()
        WHERE [Region Desc] = 'EMEA'
        GROUP BY [Region Desc], DATEDIFF(day, [Ship By Actual Date], GETDATE());
      `);
      res.json(result.recordset);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });

  //定义一个获取状态数据的路由
  app.get('/api/order-data-emea', async (req, res) => {
    try {
      const result = await pool.request().query(`
        SELECT 
          [Region Desc] AS region, 
          [Order Status] AS orderStatus,
          COUNT(Sales_Order_Num) AS salesNum
        FROM FT_Realtime_Backlog_global()
        WHERE [Region Desc] = 'EMEA'
        GROUP BY [Region Desc], [Order Status];
      `);
      res.json(result.recordset);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });

  //表格获取数据
  app.get('/api/table-data-emea', async (req, res) => {
    try {
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
      WHERE [Region Desc] = 'EMEA';`);
      res.json(result.recordset);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Server error');
    }
  });



  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/api`);
  });
}).catch(err => {
  console.error('Database connection failed', err);
});
