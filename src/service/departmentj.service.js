const connection = require("../app/database");

class DepartmentService {
  // 创建部门
  async createDepartmentService({ name, parentId = 1, leader = "chenfan" }) {
    try {
      if (name === undefined) {
        return {
          code: 400,
          data: "部门名不能为空空",
        };
      }
      // 判断创建的部门是否已经存在
      const statement = `SELECT name FROM department WHERE name = ?`;
      const result = await connection.execute(statement, [name]);
      if (result[0].length != 0) {
        return {
          code: 400,
          data: "该部门已经存在",
        };
      }
      // 如果不存在，创建部门
      const statement1 = `INSERT INTO department (name, parentId, leader)
                          VALUES (?, ?, ?);`;
      const result1 = await connection.execute(statement1, [
        name,
        parentId,
        leader,
      ]);
      return {
        code: 0,
        data: "创建部门成功",
      };
    } catch (err) {
      console.log(err);
    }
  }

  // 删除部门
  async deleteDepartmentService(id) {
    try {
      const statement = `DELETE FROM department WHERE department.id = ?`;
      const result = await connection.execute(statement, [id]);
      if (result[0].affectedRows != 0) {
        return "删除部门成功";
      } else {
        return "删除部门失败";
      }
    } catch (err) {
      console.log(err);
    }
  }

  // 更新部门
  async patchDepartmentService({ name, leader = "chenfan", parentId = 1 }, id) {
    try {
      if (name === undefined) {
        return {
          code: 400,
          data: "部门名不能为空",
        };
      }
      const statement = `UPDATE department SET name = ?, leader = ?, parentId = ? WHERE id = ?;`;
      const result = await connection.execute(statement, [
        name,
        leader,
        parentId,
        id,
      ]);
      if (result[0].affectedRows != 0) {
        return {
          code: 0,
          data: "修改成功",
        };
      } else {
        return {
          code: 400,
          data: "修改失败",
        };
      }
    } catch (err) {
      console.log(err);
    }
  }

  // 获取单个部门
  async getDepartmentService(id) {
    try {
      const statement = `SELECT id, name, parentId, createAt, updateAt, leader FROM department WHERE department.id = ?;`;
      const result = await connection.execute(statement, [id]);
      return result[0][0];
    } catch (err) {
      console.log(err);
    }
  }

  // 获取部门列表
  async getDepartmentListService({
    id = "",
    name = "",
    leader = "",
    size = 10,
    offset = 0,
  }) {
    try {
      const statement = `SELECT
                          id, name, parentId, leader, createAt, updateAt
                         FROM department
                         WHERE id like '%${id}%'
                         and name like '%${name}%'
                         and leader like '%${leader}%'
                         LIMIT ${size} OFFSET ${offset};`;
      const statement1 = `SELECT COUNT(*) totalCount from department WHERE id like '%${id}%'
                          and name like '%${name}%'
                          and leader like '%${leader}%';`;
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

module.exports = new DepartmentService();
