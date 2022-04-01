const Router = require("koa-router");

const { verifyToken } = require("../middleware/auth.middleware");
const {
  createRole,
  deleteRole,
  patchRole,
  getRole,
  getRoleList,
  getMenuByRoleId,
  getMenuIds,
  assignPermission,
} = require("../controller/role.controller");

const roleRouter = new Router({ prefix: "/role" });

// 创建角色
roleRouter.post("/", verifyToken, createRole);

// 删除角色
roleRouter.delete("/:id", verifyToken, deleteRole);

// 更新角色
roleRouter.patch("/:id", verifyToken, patchRole);

// 获取单个角色
roleRouter.get("/:id", verifyToken, getRole);

// 获取角色列表
roleRouter.post("/list", verifyToken, getRoleList);

// 根据角色id获取角色菜单
roleRouter.get("/:id/menu", verifyToken, getMenuByRoleId);

// 根据角色id获取角色菜单id数组
roleRouter.get("/:id/menuIds", verifyToken, getMenuIds);

// 给就是分配权限
roleRouter.post("/assign", verifyToken, assignPermission);

module.exports = roleRouter;
