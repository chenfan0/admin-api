const Router = require("koa-router");

const loginRouter = new Router();

const { login } = require("../controller/login.controller");
const { verigyLogin } = require("../middleware/auth.middleware");

// 登录请求
loginRouter.post("/login", verigyLogin, login);

module.exports = loginRouter;
