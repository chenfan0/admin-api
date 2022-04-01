const {
  createGoodsService,
  deleteGoodsService,
  patchGoodsService,
  getGoodsService,
  getGoodsListService,
  getCategoryCountService,
  getCategorySaleService,
  getCategoryFavorService,
  getSaleTopTenService,
  getAddressSaleSevice,
} = require("../service/goods.service");

class GoodsController {
  // 创建商品
  async createGoods(ctx, next) {
    const result = await createGoodsService(ctx.request.body);
    ctx.body = result;
  }
  // 删除商品
  async deleteGoods(ctx, next) {
    const result = await deleteGoodsService(ctx.params.id);
    ctx.body = {
      code: 0,
      data: result,
    };
  }
  // 更新商品
  async patchGoods(ctx, next) {
    try {
      const result = await patchGoodsService(ctx.request.body, ctx.params.id);
      ctx.body = result;
    } catch (e) {
      console.log(e);
    }
  }
  // 获取单个商品
  async getGoods(ctx, next) {
    const result = await getGoodsService(ctx.params.id);
    ctx.body = {
      code: 0,
      data: result,
    };
  }
  // 获取商品列表
  async getGoodsList(ctx, next) {
    const result = await getGoodsListService(ctx.request.body);
    ctx.body = result;
  }
  // 获取每个分类商品的个数
  async getCategoryCount(ctx, next) {
    const result = await getCategoryCountService();
    ctx.body = {
      code: 0,
      data: result,
    };
  }
  // 获取分类商品的销量
  async getCategorySale(ctx, next) {
    const result = await getCategorySaleService();
    ctx.body = {
      code: 0,
      data: result,
    };
  }
  // 获取每个分类商品的收藏
  async getCategoryFavor(ctx, next) {
    const result = await getCategoryFavorService();
    ctx.body = {
      code: 0,
      data: result,
    };
  }
  // 获取销量前10商品
  async getSaleTopTen(ctx, next) {
    const result = await getSaleTopTenService();
    ctx.body = {
      code: 0,
      data: result,
    };
  }
  // 获取不同城市的销量数据
  async getAddressSale(ctx, next) {
    const result = await getAddressSaleSevice();
    ctx.body = {
      code: 0,
      data: result,
    };
  }
}

module.exports = new GoodsController();
