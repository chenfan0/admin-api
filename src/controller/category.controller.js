const {
  createCategoryService,
  deleteCategoryService,
  patchCategoryService,
  getCategoryService,
  getCategoryListService,
} = require("../service/category.service");

class CategoryController {
  // 创建类别
  async creaetCategory(ctx, next) {
    const result = await createCategoryService(ctx.request.body);
    ctx.body = result
  }
  // 删除类别
  async deleteCategory(ctx, next) {
    const result = await deleteCategoryService(ctx.params.id);
    ctx.body = result
  }
  // 更新类别
  async patchCategory(ctx, next) {
    const result = await patchCategoryService(ctx.request.body, ctx.params.id)
    ctx.body = result
  }
  // 获取单个类别
  async getCategory(ctx, next) {
    const result = await getCategoryService(ctx.params.id)
    ctx.body = {
      code: 0,
      data: result
    }
  }
  // 获取类别列表
  async getCategoryList(ctx, next) {
    const result = await getCategoryListService(ctx.request.body)
    ctx.body = result
  }
}

module.exports = new CategoryController();
