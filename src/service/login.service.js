const connection = require('../app/database')

class LoginService {
  // 获取用户名
  async getUserName(name) {
    try {
      const statement = `SELECT * FROM users WHERE name = ?;`
      const result = await connection.execute(statement, [name])
      return result
    } catch (err) {
      return err
    }
  }
  // 检查密码是否正确
  async checkPassword(name) {
    try {
      const statement = `SELECT * FROM users WHERE name = ?;`
      const result = await connection.execute(statement, [name])
      return result[0]
    } catch (err) {
      return err
    }
  }
}

module.exports = new LoginService()
