const {
  createRoleService,
  deleteRoleService,
  patchRoleService,
  getRoleService,
  getRoleListService,
  getMenuByIdService,
  getMenuIdsService,
  assignPermissionService,
} = require("../service/role.service");

class RoleController {
  // 创建角色
  async createRole(ctx, next) {
    const result = await createRoleService(ctx.request.body);
    ctx.body = result;
  }
  // 删除角色
  async deleteRole(ctx, next) {
    const result = await deleteRoleService(ctx.params.id);
    ctx.body = {
      code: 0,
      data: result,
    };
  }
  // 更新角色
  async patchRole(ctx, next) {
    const result = await patchRoleService(ctx.request.body, ctx.params.id);
    ctx.body = result;
  }
  // 获取单个角色
  async getRole(ctx, next) {
    const result = await getRoleService(ctx.params.id);
    ctx.body = {
      code: 0,
      data: result,
    };
  }
  // 获取角色列表
  async getRoleList(ctx, next) {
    const result = await getRoleListService(ctx.request.body);
    ctx.body = result;
  }
  // 根据id获取角色菜单
  async getMenuByRoleId(ctx, next) {
    const result = await getMenuByIdService(ctx.params.id);
    ctx.body = {
      code: 0,
      data: result,
    };
  }
  // 通过roleid获取拥有的菜单id
  async getMenuIds(ctx, next) {
    const result = await getMenuIdsService(ctx.params.id);
    ctx.body = {
      code: 0,
      data: result,
    };
  }
  // 给角色分配权限
  async assignPermission(ctx, next) {
    const result = await assignPermissionService(ctx.request.body);
    ctx.body = {
      code: 0,
      data: result,
    };
  }
}

module.exports = new RoleController();
