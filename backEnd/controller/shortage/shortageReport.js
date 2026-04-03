const { poolPromise } = require('../../config/dbConfig');
//const XLSX = require('xlsx');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');
const crypto = require('crypto');
//const XLSXStyle = require('xlsx-style');
// 配置 multer，将文件保存到指定文件夹

// 配置 multer，将文件保存到指定文件夹

// 配置 multer，将文件保存到指定文件夹
// ===== Upload config (secure) =====
const uploadPath = '\\\\RPTPWPENDB01.apac.dell.com\\WebUpload';

// 只允许安全字符，其他都替换成 _
const sanitize = (s) => (s ?? 'unknown').toString().trim().replace(/[^a-zA-Z0-9_-]/g, '_');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.xlsx') return cb(new Error('Invalid file type'));

    const adUsername = sanitize(req.body.ad_username);
    cb(null, `Shortage_Template_${adUsername}.xlsx`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, path.extname(file.originalname).toLowerCase() === '.xlsx'),
});

// uploadData 不再 rename，只返回成功
const uploadData = (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });
  return res.json({ message: 'File uploaded successfully!' });
};
  

  





const getPartNums = async (req, res) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query("SELECT Sub_Region, [Part Num], [Sales Order Number], [Part Description], [Order Status], [Project ID], PM_NAME, [Salesrep Name], [DISCP PSM Comment], [SC3 Comments], [Final Recovery ETA], [CS Fulfillment Comments],  ESD_Aging, [<-15D],  [-15D~-3D], [-3D~0D], [0D~10D], [10D~30D], [30D~60D], [60D~90D], [>=90D] FROM FT_CS_Backlog_Shortage_Project_PM_Summary_AgingGroup() WHERE [Part Description] LIKE 'SI%'");
      res.json(result.recordset);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

  const getPartNumCounts = async (req, res) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
      SELECT [Part Num], COUNT(*) AS PartNumCount
      FROM FT_CS_Backlog_Shortage_Project_PM_Summary_AgingGroup()
      WHERE [Part Description] LIKE 'SI%'
      GROUP BY [Part Num]
      ORDER BY PartNumCount DESC
      `);
      res.json(result.recordset);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

  const getTotalQty = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
        select TOTAL_UNIT from FT_CS_Backlog_Shortage_Project_PM_Unit()
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

  const getCSDistinctPartNumCount = async (req, res) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
        SELECT COUNT(DISTINCT [Part Num]) AS DistinctPartNumCount
        FROM FT_CS_Backlog_Shortage_Project_PM_Summary_AgingGroup()
        WHERE [Part Description] LIKE 'SI%'
      `);
      res.json(result.recordset);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

  const getDistinctPartNumCount = async (req, res) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
        SELECT COUNT(DISTINCT [Part Num]) AS DistinctPartNumCount
        FROM FT_CS_Backlog_Shortage_Project_PM_Summary_AgingGroup()
      `);
      res.json(result.recordset);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

  const getESDAgingCounts = async (req, res) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
      WITH RankedOrders AS (
        SELECT 
            ESD_Aging, 
            [Sales Order Number],
            ROW_NUMBER() OVER (PARTITION BY [Sales Order Number] ORDER BY ESD_Aging) AS rn
        FROM FT_CS_Backlog_Shortage_Project_PM_Summary_AgingGroup()
        WHERE [Part Description] LIKE 'SI%'
    )
    SELECT 
        ESD_Aging, 
        COUNT(*) AS ESD_AgingCount
    FROM RankedOrders
    WHERE rn = 1
    GROUP BY ESD_Aging
    ORDER BY 
      CASE 
        WHEN ESD_Aging = '<-15D' THEN 0
        WHEN ESD_Aging = '-15D~-3D' THEN 1
        WHEN ESD_Aging = '-3D~0D' THEN 2
        WHEN ESD_Aging = '0D~10D' THEN 3
        WHEN ESD_Aging = '10D~30D' THEN 4
        WHEN ESD_Aging = '30D~60D' THEN 5
      WHEN ESD_Aging = '60D~90D' THEN 6
        WHEN ESD_Aging = '>=90D' THEN 7
      END;
      
      `);
      res.json(result.recordset);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

  const getSalesOrderNumberCounts = async (req, res) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
      SELECT COUNT([Sales Order Number]) AS TotalSalesOrderCount
      FROM FT_CS_Backlog_Shortage_Project_PM_Summary_AgingGroup()
      WHERE [Part Description] LIKE 'SI%'
      `);
      res.json(result.recordset);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

  const exportData = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(
      "SELECT Sub_Region, [Part Num], [Sales Order Number], [Part Description], [Order Status], [Project ID], PM_NAME, [Salesrep Name], [DISCP PSM Comment], [SC3 Comments], [Final Recovery ETA], [CS Fulfillment Comments], ESD_Aging, [<-15D], [-15D~-3D], [-3D~0D], [0D~10D], [10D~30D], [30D~60D], [60D~90D], [>=90D] FROM FT_CS_Backlog_Shortage_Project_PM_Summary_AgingGroup() WHERE [Part Description] LIKE 'SI%'"
    );

    const data = result.recordset;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // 1) 写表头
    const headers = Object.keys(data[0] || {});
    worksheet.addRow(headers);

    // 2) 写数据行
    for (const row of data) {
      worksheet.addRow(headers.map((h) => row[h]));
    }

    // 3) 找到 "CS Fulfillment Comments" 列，给表头上色
    const targetHeader = 'CS Fulfillment Comments';
    const targetIndex = headers.indexOf(targetHeader);
    if (targetIndex >= 0) {
      const cell = worksheet.getRow(1).getCell(targetIndex + 1);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' }, // 黄
      };
    }

    // 4) 输出 buffer
    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="CS Part Shortage Report.xlsx"'
    );
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error(err);
    res.status(500).send('从数据库导出数据时发生错误');
  }
};



  
  module.exports = {
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
  };