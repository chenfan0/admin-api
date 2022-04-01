const connection = require("../app/database");

class RoleService {
  // 创建角色
  async createRoleService({ name, intro, menuList = [] }) {
    try {
      // 判断参数是否传递正确
      if (name === undefined || intro === undefined || menuList.length === 0) {
        return {
          code: 400,
          data: "创建角色失败",
        };
      }
      // 判断创建的角色是否已经存在
      const statement = `SELECT name FROM role WHERE name = ?`;
      const result = await connection.execute(statement, [name]);
      if (result[0].length != 0) {
        return {
          code: 400,
          data: "该角色已经存在",
        };
      }
      // 如果不存在，创建角色
      const statement1 = `INSERT INTO role (name, intro)
                          VALUES (?, ?);`;
      const result1 = await connection.execute(statement1, [name, intro]);
      const id = result1[0].insertId;
      const statement2 = `INSERT INTO role_menu (roleId, menuId)
      VALUES (?, ?);`;
      const statement3 = `INSERT INTO role_permission (roleId, permissionId)
      VALUES (?, ?);`;
      for (let i = 0; i < menuList.length; i++) {
        if (menuList[i] < 9991000) {
          const result = await connection.execute(statement2, [
            id,
            menuList[i],
          ]);
        } else {
          const result = await connection.execute(statement3, [
            id,
            menuList[i],
          ]);
        }
      }
      return {
        code: 0,
        data: "角色创建成功",
      };
    } catch (err) {
      console.log(err);
    }
  }
  // 删除角色
  async deleteRoleService(id) {
    try {
      const statement = `DELETE FROM role_menu WHERE roleId = ?`;
      const result = await connection.execute(statement, [id]);
      // 删除部门表的role
      const statement1 = `DELETE FROM role WHERE role.id = ?`;
      const result1 = await connection.execute(statement1, [id]);
      // 删除role_menu表关于该role的信息
      if (result1[0].affectedRows != 0) {
        return "删除角色成功";
      } else {
        return "删除角色失败";
      }
    } catch (err) {
      console.log(err);
    }
  }
  // 更新角色
  async patchRoleService({ name = "", intro = "", menuList = [] }, id) {
    try {
      // 更新用户名和intro
      if (name === "" || intro === "" || menuList.length === 0) {
        return {
          code: 400,
          data: "修改角色失败",
        };
      }
      if (
        !menuList.includes(1) ||
        !menuList.includes(6) ||
        !menuList.includes(5)
      ) {
        return {
          code: 400,
          data: "角色必须拥有完整的系统总览权限",
        };
      }
      const statement = `UPDATE role SET name = ?, intro = ? WHERE id = ?;`;
      const result = await connection.execute(statement, [name, intro, id]);
      // 这里我先将该roleId的的菜单和权限都删除了，这样就不用判断是否表中已有该权限
      const statement2 = `DELETE FROM role_menu WHERE roleId = ?;`;
      const statement3 = `DELETE FROM role_permission WHERE roleId = ?`;
      // 将menulist中的全部添加
      const statement4 = `INSERT INTO role_menu (roleId, menuId) VALUES (?, ?);`;
      const statement5 = `INSERT INTO role_permission (roleId, permissionId) VALUES (?, ?);`;
      await connection.execute(statement2, [id]);
      await connection.execute(statement3, [id]);
      for (let i = 0; i < menuList.length; i++) {
        if (menuList[i] < 9991000) {
          await connection.execute(statement4, [id, menuList[i]]);
        } else {
          await connection.execute(statement5, [id, menuList[i]]);
        }
      }
      if (result[0].affectedRows != 0) {
        return {
          code: 0,
          data: "更新角色成功",
        };
      } else {
        return {
          code: 0,
          data: "修改角色失败",
        };
      }
    } catch (err) {
      console.log(err);
    }
  }
  // 获取单个角色
  async getRoleService(id) {
    try {
      const statement = `SELECT id, name, intro, createAt, updateAt FROM role WHERE role.id = ?;`;
      const result = await connection.execute(statement, [id]);
      return result[0][0];
    } catch (err) {
      console.log(err);
    }
  }
  // 获取角色列表
  async getRoleListService({
    name = "",
    createAt = ["2011-09-30T16:00:00.000Z", "2121-10-02T16:00:00.000Z"],
    size = 10,
    offset = 0,
  }) {
    try {
      const statement = `SELECT r.id, r.name, r.intro, r.createAt, r.updateAt,
        JSON_ARRAYAGG(JSON_OBJECT('id', m.id, 'name', m.name, 'type', m.type, 'url', m.url, 'icon', m.icon, 
        'children', (
        SELECT JSON_ARRAYAGG(JSON_OBJECT('id', menu.id, 'url', menu.url, 'name', menu.name, 'type', menu.type,
        'children', (
          SELECT JSON_ARRAYAGG(JSON_OBJECT('id', permission.id, 'name', permission.name, 'type', permission.type, 'parentId', permission.parentId, 'permission', permission.permission)) FROM permission LEFT JOIN role_permission ON permission.id = role_permission.permissionId WHERE role_permission.roleId = r.id && permission.parentId = menu.id
          )
        )) FROM menu WHERE m.id = menu.parentId
        )
        )) menuList
        FROM role r 
        LEFT JOIN role_menu rm ON r.id = rm.roleId
        LEFT JOIN menu m ON rm.menuId = m.id
        WHERE m.type = 1 and r.name Like '%${name}%'
        GROUP BY r.id
        LIMIT ${size} OFFSET ${offset};`;
      const result = await connection.execute(statement, []);
      const statement1 = `SELECT COUNT(*) totalCount from role where role.name Like '%${name}%'
      and  (DATE_FORMAT(role.createAt, '%Y-%m-%d hh:mm:ss') BETWEEN DATE_FORMAT('${createAt[0]}', '%Y-%m-%d hh:mm:ss')
      and DATE_FORMAT('${createAt[1]}', '%Y-%m-%d hh:mm:ss')) ;`;
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
  // 根据id获取角色菜单
  async getMenuByIdService(id) {
    try {
      const statement = `SELECT roleId FROM users WHERE id = ?`;
      const result = await connection.execute(statement, [id]);
      const roleId = result[0][0].roleId;
      const statement1 = `SELECT menu.id,  menu.name, menu.type,  menu.url,  menu.icon, (
        SELECT JSON_ARRAYAGG(JSON_OBJECT('id', m2.id, 'url', m2.url, 'name', m2.name, 'type', m2.type, 'parentId', m2.parentId,
        'children', (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', p.id, 'name', p.name, 'type', p.type, 'parentId', p.parentId, 'permission', p.permission)) FROM permission p LEFT JOIN role_permission ON p.id = role_permission.permissionId
        LEFT JOIN role_menu ON role.id = role_menu.roleId
        LEFT JOIN menu ON role_menu.menuId = menu.id 
         WHERE p.parentId = m2.id AND role_permission.roleId = role.id and role.id = ? AND menu.type = 2)
         )) FROM menu m LEFT JOIN menu m2 ON m.id = m2.parentId
        WHERE m.type = 1 AND m2.parentId = menu.id) children
        FROM role 
        LEFT JOIN role_menu ON role.id = role_menu.roleId
        LEFT JOIN menu ON role_menu.menuId = menu.id
        WHERE role.id = ? AND menu.type = 1
         GROUP BY menu.id;`;
      const result1 = await connection.execute(statement1, [roleId, roleId]);
      return result1[0];
    } catch (e) {
      console.log(e);
    }
  }
  // 根据id获取菜单id
  async getMenuIdsService(id) {
    try {
      const statement = `SELECT role.id , role.name, role.intro,  JSON_ARRAY((SELECT GROUP_CONCAT(menuId SEPARATOR ',') FROM role_menu WHERE roleId = 1)) menuIds
                          FROM role
                        LEFT JOIN role_menu ON role.id = role_menu.roleId
                        WHERE role.id = ? GROUP BY id`;
      const result = await connection.execute(statement, [id]);
      // 将字符串转换为数组
      result[0][0].menuIds = result[0][0].menuIds[0].split(",");
      // 将数组里的字变为number类型
      result[0][0].menuIds = result[0][0].menuIds.map((item) => Number(item));
      return result[0][0];
    } catch (err) {
      console.log(err);
    }
  }
  // 给角色分配权限
  async assignPermissionService({ roleId, menuList }) {
    // 查询分配的id是否已经拥有
    const statement = `SELECT id FROM role_menu WHERE roleId = ? && menuId = ?`;
    // 插入数据
    const statement1 = `INSERT INTO role_menu (roleId, menuId)
                        VALUES (?, ?);`;
    for (let i = 0; i < menuList.length; i++) {
      const result = await connection.execute(statement, [roleId, menuList[i]]);
      if (result[0].length == 0) {
        // 插入的menuid原来没有
        const result1 = await connection.execute(statement1, [
          roleId,
          menuList[i],
        ]);
      } else {
        continue;
      }
    }
    return "分配成功";
  }
}

module.exports = new RoleService();
