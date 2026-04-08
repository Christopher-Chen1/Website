const express = require('express');
const cors = require('cors');
// const { errorHandler } = require('./middlewares/errorHandler');
//const routes = require('./routes');
const allRegionRoutes = require('./routes/allRegionIndex');
const apjRegionRoutes = require('./routes/APJRegionIndex');
const daoRegionRoutes = require('./routes/DAORegionIndex');
const emeaRegionRoutes = require('./routes/EMEARegionIndex');
const shortageRoutes = require('./routes/shortageIndex');
const secondTorchRoutes = require('./routes/secondTorchIndex');
const issueTrackerRoutes = require('./routes/issueTrackerIndex');
//const fileUpload = require('express-fileupload');
require('dotenv').config(); // 加载 .env 文件中的环境变量

const app = express();
app.disable('x-powered-by');
const port = process.env.PORT;

// 启用 CORS
app.use(cors());

// 使用 JSON 解析中间件
app.use(express.json());
// 使用 urlencoded 解析表单数据（用于 ad_username）
app.use(express.urlencoded({ extended: true }));

//app.use(fileUpload());

// 使用路由
app.use('/api', allRegionRoutes);
app.use('/api', apjRegionRoutes);
app.use('/api', daoRegionRoutes);
app.use('/api', emeaRegionRoutes);
app.use('/api', shortageRoutes);
app.use('/api', secondTorchRoutes);
app.use('/api', issueTrackerRoutes);

// 错误处理中间件
//app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
