const connection = require('../app/database')

class StoryService {
  // 创建故事
  async createStoryService({ title, content }) {
    try {
      const statement = `INSERT INTO story (title, content)
                          VALUES (?, ?);`;
      const result1 = await connection.execute(statement, [
        title,
        content
      ]);
      return "故事创建成功";
    } catch (err) {
      console.log(err);
    }
  }
  // 获取故事列表
  async getStoryListService({ size = 10, offset = 0 }) {
    try {
      const statement = `SELECT
                          id, title, content, createAt, updateAt
                         FROM story
                         LIMIT ${size} OFFSET ${offset};`;
      const statement1 = `SELECT COUNT(*) totalCount from story;`;
      const result = await connection.execute(statement);
      const result1 = await connection.execute(statement1, []);
      return {
        code: 0,
        data: {
          list: result[0],
          totalCount: result1[0][0].totalCount
        },
      };
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new StoryService()
