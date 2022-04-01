const fs = require("fs");
const jwt = require("jsonwebtoken");

const errorTypes = require("../constants/error-types");
const md5password = require("../utilis/password-handle");
const PublicKey = fs.readFileSync("./public.key");

const { getUserName, checkPassword } = require("../service/login.service");

// 验证登录账号密码中间件
const verigyLogin = async (ctx, next) => {
  try {
    // 获取用户名和密码
    const { name, password } = ctx.request.body;
    // 判断用户名或密码是否为空
    if (!name || !password) {
      const error = new Error(errorTypes.USERNAME_PASSWORD_IS_REQUIRED);
      ctx.app.emit("error", error, ctx);
      return;
    }
    // 判断数据库中是否存在该用户名
    const result = await getUserName(name);
    if (result[0].length === 0) {
      // const error = new Error(errorTypes.USERNAME_NOT_EXISTS);
      // ctx.app.emit("error", error, ctx);
      ctx.body = {
        code: 400,
        data: "用户名不存在",
      };
      return;
    }
    // 判断密码是否正确
    const correctPassword = await checkPassword(name);
    if ((await md5password(password)) !== correctPassword[0].password) {
      // const error = new Error(errorTypes.PASSWORD_ERROR);
      // ctx.app.emit("error", error, ctx);
      ctx.body = {
        code: 400,
        data: "密码错误",
      };
      return;
    }
    ctx.user = result[0][0];
    await next();
  } catch (err) {
    console.log(err);
  }
};

const verifyToken = async (ctx, next) => {
  if (ctx.headers.authorization) {
    const authorization = ctx.headers.authorization;
    const token = authorization.replace("Bearer ", "");

    try {
      const result = jwt.verify(token, PublicKey, { algorithms: ["RS256"] });
      ctx.user = result;
      await next();
    } catch (err) {
      const error = new Error(errorTypes.NOT_AUTHORIZATION);
      ctx.app.emit("error", error, ctx);
    }
  } else {
    const error = new Error(errorTypes.NOT_AUTHORIZATION);
    ctx.app.emit("error", error, ctx);
  }
};

module.exports = {
  verigyLogin,
  verifyToken,
};
