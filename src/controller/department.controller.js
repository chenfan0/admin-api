const {
  createDepartmentService,
  deleteDepartmentService,
  patchDepartmentService,
  getDepartmentService,
  getDepartmentListService,
} = require("../service/departmentj.service");

class DepartmentController {
  // 创建部门
  async createDepartment(ctx, next) {
    const result = await createDepartmentService(ctx.request.body);
    ctx.body = result;
  }

  // 删除部门
  async deleteDepartment(ctx, next) {
    if (ctx.params.id <= 5) {
      return (ctx.body = {
        code: 400,
        data: "该部门无法被删除",
      });
    }
    const result = await deleteDepartmentService(ctx.params.id);
    ctx.body = {
      code: 0,
      data: result,
    };
  }

  // 更新部门
  async patchDepartment(ctx, next) {
    if (ctx.params.id <= 5) {
      return (ctx.body = {
        code: 400,
        data: "该部门数据不允许被修改",
      });
    }
    const result = await patchDepartmentService(
      ctx.request.body,
      ctx.params.id
    );
    ctx.body = result;
  }

  // 获取单个部门
  async getDepartMent(ctx, next) {
    const result = await getDepartmentService(ctx.params.id);
    ctx.body = {
      code: 0,
      data: result,
    };
  }

  async getDepartmentList(ctx, next) {
    const result = await getDepartmentListService(ctx.request.body);
    ctx.body = result;
  }
}

module.exports = new DepartmentController();
