const { createMenuService, deleteMenuService, patchMenuService, getMenuService, getMenuListService } = require('../service/menu.service')

class MenuController {
  // 创建菜单
  async createMenu(ctx, next) {
    const result = await createMenuService(ctx.request.body)
    ctx.body = {
      code: 0,
      data: result
    }
  }
  // 删除菜单
  async deleteMenu(ctx, next) {
    const result = await deleteMenuService(ctx.params.id)
    ctx.body = {
      code: 0,
      data: result
    }
  }
  // 修改菜单
  async patchMenu(ctx, next) {
    const result = await patchMenuService(ctx.request.body, ctx.params.id)
    ctx.body = {
      code: 0,
      data: result
    }
  }
  // 获取单个菜单
  async getMenu(ctx, next) {
    const result = await getMenuService(ctx.params.id)
    ctx.body = {
      code: 0,
      data: result
    }
  }
  // 获取菜单列表
  async getMenuList(ctx, next) {
    const result = await getMenuListService(ctx.request.body)
    ctx.body = result
  }
}

module.exports = new MenuController()

