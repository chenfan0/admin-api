const app = require("./app");

require("./app/database");
app.listen(10001, () => {
  console.log("服务器启动成功");
});
