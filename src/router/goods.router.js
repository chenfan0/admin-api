const Router = require("koa-router");

const { verifyToken } = require("../middleware/auth.middleware");
const {
  createGoods,
  deleteGoods,
  patchGoods,
  getGoods,
  getGoodsList,
  getCategoryCount,
  getCategorySale,
  getCategoryFavor,
  getSaleTopTen,
  getAddressSale
} = require("../controller/goods.controller");

const goodsRouter = new Router({ prefix: "/goods" });

// 创建商品
goodsRouter.post("/", verifyToken, createGoods);

// 删除商品
goodsRouter.delete("/:id", verifyToken, deleteGoods);

// 更新商品
goodsRouter.patch("/:id", verifyToken, patchGoods);

// 获取单个商品
goodsRouter.get("/:id", verifyToken, getGoods);

// 获取商品列表
goodsRouter.post("/list", verifyToken, getGoodsList);

// 获取每个分类商品的个数
goodsRouter.get("/category/count", verifyToken, getCategoryCount);

// 获取每个分类商品的销量
goodsRouter.get("/category/sale", verifyToken, getCategorySale);

// 获取每个分类商品的收藏
goodsRouter.get('/category/favor', verifyToken, getCategoryFavor)

// 获取销量前10商品
goodsRouter.get('/sale/top10', verifyToken, getSaleTopTen)

// 获取不同城市的销量数据
goodsRouter.get('/address/sale', verifyToken, getAddressSale)

module.exports = goodsRouter;
