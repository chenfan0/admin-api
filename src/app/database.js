const mysql = require("mysql2");

// 创建连接池
const connections = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "cms",
  // password: "c13005261761F",
  password: "c18688062638f",
});

// 测试是否连接成功
connections.getConnection((err, conn) => {
  conn.connect((err) => {
    if (err) {
      console.log("数据库连接失败", err);
    } else {
      console.log("数据库连接成功~");
    }
  });
});

module.exports = connections.promise();
