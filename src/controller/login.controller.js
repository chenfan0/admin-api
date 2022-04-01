const fs = require("fs");

const jwt = require("jsonwebtoken");
const PRIVATE_KEY = fs.readFileSync("./private.key");

class AuthController {
  // 登录中间件
  async login(ctx, next) {
    try {
      const { id, name } = ctx.user;
      const token = jwt.sign({ id, name }, PRIVATE_KEY, {
        expiresIn: 60 * 60 * 24,
        algorithm: "RS256",
      });

      ctx.body = {
        code: 0,
        data: {
          id,
          name,
          token,
        },
      };
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new AuthController();
