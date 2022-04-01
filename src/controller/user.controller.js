const {
  createUserService,
  deleteUserService,
  patchUserService,
  getUserService,
  getUserListService,
} = require("../service/users.service");

const { USERNAME_ALREADY_EXISTS } = require("../constants/error-types");

class UserController {
  // 创建用户
  async createUser(ctx, next) {
    const result = await createUserService({ ...ctx.request.body });
    // 创建用户成功
    ctx.body = result;
    // 用户名已经被注册
    // if (result === USERNAME_ALREADY_EXISTS) {
    //   const error = new Error(USERNAME_ALREADY_EXISTS);
    //   ctx.app.emit("error", error, ctx);
    // }
  }

  // 删除用户
  async deleteUser(ctx, next) {
    if (ctx.params.id == 1) {
      return (ctx.body = {
        code: 400,
        data: "该用户无法被删除",
      });
    }
    const result = await deleteUserService(ctx.params.id);
    if (result.affectedRows == 0) {
      return (ctx.body = {
        code: 400,
        data: "删除失败",
      });
    }
    if (result.affectedRows == 1) {
      return (ctx.body = {
        code: 0,
        data: "删除成功",
      });
    }
  }

  // 修改用户
  async patchUser(ctx, next) {
    if (ctx.params.id == 1) {
      return (ctx.body = {
        code: 400,
        data: "该用户信息不允许被修改",
      });
    }
    const result = await patchUserService(ctx.request.body, ctx.params.id);
    ctx.body = result;
  }

  // 获取某个用户
  async getUser(ctx, next) {
    const result = await getUserService(ctx.params.id);
    return (ctx.body = {
      code: 0,
      data: result,
    });
  }

  // 获取用户列表
  async getUserList(ctx, next) {
    const result = await getUserListService(ctx.request.body);
    return (ctx.body = result);
  }
}

module.exports = new UserController();
