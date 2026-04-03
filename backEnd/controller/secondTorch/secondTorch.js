const { poolPromise } = require('../../config/dbConfig');

const getVendorCount = async (req, res) => {
 try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
       SELECT 
    vendorName1,
    COUNT(*) AS vendor_count
FROM 
    FT_Realtime_2T_Backlog_Vendor()
GROUP BY 
    vendorName1
ORDER BY 
    vendor_count DESC;  -- 可选，按数量从高到低排序

      `);
      res.json(result.recordset);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
};


  
  module.exports = {
    getVendorCount
  };