const connection = require("../app/database");

const { USERNAME_ALREADY_EXISTS } = require("../constants/error-types");
const md5 = require("../utilis/password-handle");

class UsersService {
  // 创建用户
  async createUserService({
    name,
    password,
    realname = "xxx",
    cellphone = 123,
    enable = 1,
    departmentId,
    roleId,
  }) {
    try {
      if (
        name === undefined ||
        password === undefined ||
        departmentId === undefined ||
        roleId === undefined
      ) {
        return {
          code: 400,
          data: "用户名,密码,部门,角色不能为空",
        };
      }
      if (name.length < 3) {
        return {
          code: 400,
          data: "用户名长度不能小于3",
        };
      }
      if (password.length < 3) {
        return {
          code: 400,
          data: "密码长度不能小于3",
        };
      }
      //  判断创建的用户名是否已经被注册
      const statement0 = `SELECT id FROM users WHERE name = ?;`;
      const result0 = await connection.execute(statement0, [name]);
      // 用户名被注册
      if (result0[0].length !== 0) {
        return {
          code: 400,
          data: "用户名已经被注册",
        };
      }
      // 用户名没有被注册，进行创建用户操作
      const statement = `INSERT INTO users (name, password, realname, cellphone, enable, departmentId, roleId)
                         VALUES (?, ?, ?, ?, ?, ?, ?);`;
      const result = await connection.execute(statement, [
        name,
        md5(password),
        realname,
        cellphone,
        enable,
        departmentId,
        roleId,
      ]);
      return {
        code: 0,
        data: "创建用户成功",
      };
    } catch (err) {
      console.log(err);
    }
  }

  // 删除用户
  async deleteUserService(id) {
    const statement = `DELETE FROM users WHERE users.id = ?;`;
    const result = await connection.execute(statement, [id]);
    return result[0];
  }

  // 修改用户
  async patchUserService(
    { name, realname = "", cellphone = "", enable = 1, departmentId, roleId },
    id
  ) {
    try {
      if (
        name === undefined ||
        departmentId === undefined ||
        roleId === undefined
      ) {
        return {
          code: 400,
          data: "用户名,部门,角色不能为空",
        };
      }
      if (name.length < 3) {
        return {
          code: 400,
          data: "用户名长度不能小于3",
        };
      }
      const statement = `UPDATE users SET name = ?, realname = ?, cellphone = ?, enable = ?, departmentId = ?, roleId = ?
      WHERE id = ?
      ;`;
      const result = await connection.execute(statement, [
        name,
        realname,
        cellphone,
        enable,
        departmentId,
        roleId,
        id,
      ]);
      return {
        code: 0,
        data: "修改用户信息成功",
      };
    } catch (err) {
      console.log(err);
    }
  }

  // 获取单个用户信息
  async getUserService(id) {
    try {
      const statement = `SELECT users.id , users.name, users.realname, users.cellphone, users.enable, users.createAt, users.updateAt,
        JSON_OBJECT('id', role.id, 'name', role.name, 'intro', role.intro, 'createAt', role.createAt, 'updateAT', role.updateAT) role,
        JSON_OBJECT('id', department.id, 'name', department.name, 'parentId', department.parentId, 'createAt', department.createAt, 'updateAT', department.updateAT)
        department
        FROM
        users LEFT JOIN role ON users.roleId = role.id
        LEFT JOIN department ON users.departmentId = department.id
        WHERE users.id = ?;`;
      const result = await connection.execute(statement, [id]);
      return result[0][0];
    } catch (err) {
      console.log(err);
    }
  }

  // 获取用户列表信息
  async getUserListService({
    name = "",
    size = 10,
    offset = 0,
    id = "",
    realname = "",
    cellphone = "",
    enable = "",
    createAt = ["2021-09-30T16:00:00.000Z", "2029-10-02T16:00:00.000Z"],
  }) {
    try {
      const statement = `SELECT
                          users.id , users.name, users.realname, users.cellphone, users.enable, users.createAt, users.updateAt, users.roleId, users.departmentId
                         FROM users WHERE name like '%${name}%' and id like '%${id}%' and realname like '%${realname}%' and cellphone like '%${cellphone}%' and enable like '%${enable}%'
                         and  (DATE_FORMAT(createAt, '%Y-%m-%d hh:mm:ss'))
                         LIMIT ${size} OFFSET ${offset};`;
      const statement1 = `SELECT COUNT(*) totalCount from users WHERE name like '%${name}%' 
                            and id like '%${id}%' and realname like '%${realname}%' 
                            and cellphone like '%${cellphone}%' 
                            and enable like '%${enable}%' 
                            and  (DATE_FORMAT(createAt, '%Y-%m-%d hh:mm:ss') BETWEEN DATE_FORMAT('${createAt[0]}', '%Y-%m-%d hh:mm:ss')
                             and DATE_FORMAT('${createAt[1]}', '%Y-%m-%d hh:mm:ss')) ;`;
      const result = await connection.execute(statement);
      const result1 = await connection.execute(statement1);
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

module.exports = new UsersService();
