// 连接 SQL Server，用户名 backlog，密码 DellGCS123#，数据库 CS_Database
const sql = require('mssql');

const config = {
  user: 'backlog',
  password: 'DellGCS123#',
  server: 'RPTPWPENDB01.apac.dell.com',
  database: 'CS_Database',
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const poolPromise = sql
  .connect(config)
  .then((pool) => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch((err) => {
    console.error('Database connection failed', err);
    throw err;
  });

module.exports = {
  sql,
  poolPromise,
};