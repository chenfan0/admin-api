const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
// const cors = require('koa2-cors')

const useRouter = require("../router/index");
const Error = require("./error.handle");
const cors = require('@koa/cors');

const app = new Koa();

app.use(cors())
app.use(bodyParser());
// 注册路由
useRouter(app);

app.on("error", Error);

module.exports = app;
