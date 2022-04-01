const connection = require("../app/database");

class GoodsService {
  // 创建商品
  async createGoodsService({
    name,
    oldPrice,
    newPrice,
    status = 1,
    imgUrl,
    inventoryCount,
    saleCount,
    favorCount,
    address,
    categoryId,
    desc,
  }) {
    try {
      const params = [
        name,
        oldPrice,
        newPrice,
        imgUrl,
        inventoryCount,
        saleCount,
        favorCount,
        address,
        categoryId,
        desc,
      ];
      if (params.includes(undefined)) {
        return {
          code: 400,
          data: "商品创建失败",
        };
      }
      // 创建商品
      const statement =
        "INSERT INTO goods (`name`, `oldPrice`, `newPrice`, `desc`, `status`, `imgUrl`, `inventoryCount`, `saleCount`, `favorCount`, `address`, `categoryId`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
      const result = await connection.execute(statement, [
        name,
        oldPrice,
        newPrice,
        desc,
        status,
        imgUrl,
        inventoryCount,
        saleCount,
        favorCount,
        address,
        categoryId,
      ]);
      // 保存商品与类别的关系
      const goodsId = result[0].insertId;
      const statement1 = `INSERT INTO goods_category (goodsId, categoryId)
                        VALUES (?, ?)`;
      const result1 = await connection.execute(statement1, [
        goodsId,
        categoryId,
      ]);
      return {
        code: 0,
        data: "商品创建成功",
      };
    } catch (err) {
      console.log(err);
    }
  }
  // 删除商品
  async deleteGoodsService(id) {
    try {
      const statement = `DELETE FROM goods WHERE goods.id = ?`;
      const result = await connection.execute(statement, [id]);
      if (result[0].affectedRows != 0) {
        return "删除商品成功";
      } else {
        return "删除商品失败";
      }
    } catch (err) {
      console.log(err);
    }
  }
  // 更新商品
  async patchGoodsService(
    {
      name,
      oldPrice,
      newPrice,
      status = 1,
      imgUrl,
      inventoryCount,
      saleCount,
      favorCount,
      address,
      categoryId,
      desc,
    },
    id
  ) {
    try {
      const params = [
        name,
        oldPrice,
        newPrice,
        imgUrl,
        inventoryCount,
        saleCount,
        favorCount,
        address,
        categoryId,
        desc,
      ];
      if (params.includes(undefined)) {
        return {
          code: 400,
          data: "修改商品数据失败",
        };
      }
      console.log(id);
      const statement =
        "UPDATE goods SET `name` = ?,`oldPrice` = ?, `newPrice` = ?, `status` = ?, `imgUrl` = ?, `inventoryCount` = ?, `saleCount` = ?, `favorCount` = ?, `address` = ?, `categoryId` = ?, `desc` = ? WHERE id = ?;";
      const result = await connection.execute(statement, [
        name,
        oldPrice,
        newPrice,
        status,
        imgUrl,
        inventoryCount,
        saleCount,
        favorCount,
        address,
        categoryId,
        desc,
        id,
      ]);
      const statement1 =
        "UPDATE goods_category SET `categoryId` = ? WHERE goodsId = ?";
      const result1 = await connection.execute(statement1, [categoryId, id]);
      if (result[0].affectedRows != 0) {
        return {
          code: 0,
          data: "修改商品成功",
        };
      } else {
        return {
          code: 400,
          data: "修改商品失败",
        };
      }
    } catch (err) {
      return "参数错误";
    }
  }
  // 获取单个商品
  async getGoodsService(id) {
    try {
      const statement =
        "SELECT id, name, oldPrice, newPrice, `desc`, status, imgUrl, inventoryCount, saleCount, favorCount, address, categoryId, createAt, updateAt FROM goods WHERE goods.id = ?;";
      const result = await connection.execute(statement, [id]);
      return result[0][0];
    } catch (err) {
      console.log(err);
    }
  }
  // 获取商品列表
  async getGoodsListService({
    name = "",
    address = "",
    size = 10,
    offset = 0,
  }) {
    try {
      const statement =
        "SELECT id, name, oldPrice, newPrice, `desc`," +
        `status, imgUrl, inventoryCount, saleCount, favorCount, address, categoryId, createAt, updateAt FROM goods
         WHERE name LIKE '%${name}%'
         and address LIKE '%${address}%'
        ` +
        " LIMIT " +
        size +
        " OFFSET " +
        offset;
      const statement1 = `SELECT COUNT(*) totalCount from goods;`;
      const result = await connection.execute(statement);
      const result1 = await connection.execute(statement1, []);
      return {
        code: 0,
        data: {
          list: result[0],
          totalCount: result1[0][0].totalCount,
        },
      };
    } catch (err) {
      console.log(err);
    }
  }
  // 获取每个分类商品的个数
  async getCategoryCountService() {
    try {
      const statement = `SELECT category.id, category.name ,
        (SELECT COUNT(*) FROM goods_category gc WHERE gc.categoryId = category.id) goodsCount
        FROM category
        LEFT JOIN goods_category ON category.id = goods_category.categoryId
        GROUP BY category.id`;
      const result = await connection.execute(statement);
      return result[0];
    } catch (err) {
      console.log(err);
    }
  }
  // 获取每个分类商品销量
  async getCategorySaleService() {
    try {
      const statement = `SELECT category.id, category.name ,
                      (SELECT SUM(g.saleCount) FROM goods g WHERE g.categoryId = category.id) goodsCount
                      FROM category
                      LEFT JOIN goods ON category.id = goods.categoryId 
                      GROUP BY category.id`;
      const result = await connection.execute(statement);
      return result[0];
    } catch (err) {
      console.log(err);
    }
  }
  // 获取每个分类商品收藏
  async getCategoryFavorService() {
    try {
      const statment = `SELECT category.id, category.name ,
          (SELECT SUM(g.favorCount) FROM goods g WHERE g.categoryId = category.id) goodsFavor
          FROM category
          LEFT JOIN goods ON category.id = goods.categoryId 
          GROUP BY category.id`;
      const result = await connection.execute(statment);
      return result[0];
    } catch (err) {
      console.log(err);
    }
  }
  // 获取销量前10的商品
  async getSaleTopTenService() {
    const statement = `SELECT id, name, saleCount FROM goods ORDER BY saleCount DESC LIMIT 10`;
    const result = await connection.execute(statement);
    return result[0];
  }
  // 获取不同城市的销量数据
  async getAddressSaleSevice() {
    try {
      const statement = `SELECT address, SUM(saleCount) count FROM goods GROUP  BY address`;
      const result = await connection.execute(statement);
      return result[0];
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new GoodsService();
