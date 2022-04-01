const errorTypes = require("../constants/error-types");

//  对错误统一进行处理
const errorHandle = (err, ctx) => {
  let status, message;
  switch (err.message) {
    case errorTypes.USERNAME_PASSWORD_IS_REQUIRED:
      status = 400;
      message = "用户名或密码不能为空";
      break;
    case errorTypes.USERNAME_ALREADY_EXISTS:
      status = 409;
      message = "用户名已被注册";
      break;
    case errorTypes.USERNAME_NOT_EXISTS:
      status = 400;
      message = "您输入的用户名不存在";
      break;
    case errorTypes.PASSWORD_ERROR:
      status = 409;
      message = "您输入的密码错误";
      break;
    case errorTypes.NOT_AUTHORIZATION:
      status = 401;
      message = "无效的token";
      break;
    case errorTypes.NOT_PERMISSION:
      status = 401;
      message = "您不具备操作的权限";
      break;
    default:
      status = 404;
      message = "NOT FOUND";
  }
  ctx.status = status;
  ctx.body = message;
};
module.exports = errorHandle;
