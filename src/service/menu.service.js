const connection = require("../app/database");

class MenuService {
  // 创建菜单
  async createMenuService({ name, type, url, icon = null, parentId = null }) {
    try {
      // 判断创建的菜单是否已经存在
      const statement = `SELECT name FROM menu WHERE name = ?`;
      const result = await connection.execute(statement, [name]);
      if (result[0].length != 0) {
        return "该菜单已经存在";
      }
      // 如果不存在，创建菜单,同时将该菜单的权限赋值给超级管理员
      const statement1 = `INSERT INTO menu (name, type, url, icon, parentId)
                          VALUES (?, ?, ?, ?, ?);`;
      const result1 = await connection.execute(statement1, [
        name,
        type,
        url,
        icon,
        parentId,
      ]);

      // 查找创建的菜单的id
      const statement2 = `SELECT id FROM menu WHERE name = ?;`;
      const result2 = await connection.execute(statement2, [name]);
      const menuId = result2[0][0].id;

      // 将创建的菜单分配给超级管理员
      const statement3 = `INSERT INTO role_menu (roleId, menuId) VALUES (1, ?)`;
      const result3 = await connection.execute(statement3, [menuId]);
      return "菜单创建成功";
    } catch (err) {
      console.log(err);
    }
  }
  // 删除菜单
  async deleteMenuService(id) {
    try {
      const statement = `DELETE FROM role_menu WHERE menuId = ?`;
      const result = await connection.execute(statement, [id]);
      const statement1 = `DELETE FROM menu WHERE id = ?`;
      const result1 = await connection.execute(statement1, [id]);
      if (result1[0].affectedRows != 0) {
        return "删除菜单成功";
      } else {
        return "删除菜单失败";
      }
    } catch (err) {
      console.log(err);
    }
  }
  // 修改菜单
  async patchMenuService(
    { name, type = 1, url, icon = null, parentId = null },
    id
  ) {
    try {
      const statement = `UPDATE menu SET name = ?, type = ?, url = ?, icon = ?, parentId = ? WHERE id = ?;`;
      const result = await connection.execute(statement, [
        name,
        type,
        url,
        icon,
        parentId,
        id,
      ]);
      if (result[0].affectedRows != 0) {
        return "修改菜单成功";
      } else {
        return "修改菜单失败";
      }
    } catch (err) {
      console.log(err);
    }
  }
  // 获取单个菜单
  async getMenuService(id) {
    try {
      const statement = `SELECT id, name, type, icon, parentId, url, createAt, updateAt FROM menu WHERE menu.id = ?;`;
      const result = await connection.execute(statement, [id]);
      return result[0][0];
    } catch (err) {
      console.log(err);
    }
  }
  // 获取菜单列表
  async getMenuListService({
    name = "",
    createAt = ["2011-09-30T16:00:00.000Z", "2121-10-02T16:00:00.000Z"],
    size = 10,
    offset = 0,
  }) {
    try {
      const statement = `SELECT m.id, m.name, m.type, m.url, m.icon,
                        JSON_ARRAYAGG(JSON_OBJECT('id', m2.id, 'url', m2.url, 'name', m2.name, 'type', m2.type, 'parentId', m2.parentId, 'children',
                        (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', p.id, 'name', p.name, 'type', p.type, 'parentId', p.parentId, 'permission', p.permission)) FROM permission p
                        WHERE p.parentId = m2.id)
                        )) children
                        FROM menu m
                        LEFT JOIN menu m2 ON m.id = m2.parentId
                        WHERE m.type = 1
                        and( m.name LIKE '%${name}%' OR m2.name LIKE '%${name}%')
                        GROUP BY m.id
                        LIMIT ${size} OFFSET ${offset};
                        ;`;
      const statement1 = `SELECT COUNT(*) totalCount from menu;`;
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

module.exports = new MenuService();
