const connection = require("../app/database");

class CategoryService {
  // 创建类别
  async createCategoryService({ name }) {
    try {
      // 判断创建的类别是否已经存在
      if (name === undefined) {
        return {
          code: 400,
          data: "请输入类别名称",
        };
      }
      const statement = `SELECT name FROM category WHERE name = ?`;
      const result = await connection.execute(statement, [name]);
      if (result[0].length != 0) {
        return "该类别已经存在";
      }
      // 如果不存在，创建该类别
      const statement1 = `INSERT INTO category (name)
                          VALUES (?);`;
      const result1 = await connection.execute(statement1, [name]);
      return "类别创建成功";
    } catch (err) {
      console.log(err);
    }
  }
  // 删除类别
  async deleteCategoryService(id) {
    const statement = `DELETE FROM category WHERE id = ?`;
    const result = await connection.execute(statement, [id]);
    if (result[0].affectedRows != 0) {
      return {
        code: 0,
        data: "删除类别成功",
      };
    } else {
      return {
        code: 400,
        data: "删除类别失败",
      };
    }
  }
  // 更新类别
  async patchCategoryService({ name }, id) {
    try {
      // 检查修改的名字是否已经存在
      if (name === undefined) {
        return {
          code: 400,
          data: "请输入类别名称",
        };
      }
      const statement = `SELECT id FROM category WHERE name = ?;`;
      const result = await connection.execute(statement, [name]);
      if (result[0].length != 0) {
        return "该类别名称已经存在";
      }
      const statement1 = `UPDATE category SET name = ? WHERE id = ?;`;
      const result1 = await connection.execute(statement1, [name, id]);
      if (result[1].affectedRows != 0) {
        return "修改类别成功";
      } else {
        return "修改类别失败";
      }
    } catch (err) {
      console.log(err);
    }
  }
  // 获取单个类别
  async getCategoryService(id) {
    try {
      const statement = `SELECT id, name, createAt, updateAt FROM category WHERE id = ?;`;
      const result = await connection.execute(statement, [id]);
      return result[0][0];
    } catch (err) {
      console.log(err);
    }
  }
  // 获取类别列表
  async getCategoryListService({ name = "", size = 10, offset = 0 }) {
    try {
      const statement = `SELECT
                          id, name, createAt, updateAt
                         FROM category WHere name LIKE '%${name}%'
                         LIMIT ${size} OFFSET ${offset};`;
      const statement1 = `SELECT COUNT(*) totalCount from category;`;
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
}

module.exports = new CategoryService();
