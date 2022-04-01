const Router = require('koa-router')

const { verifyToken } = require('../middleware/auth.middleware')
const { createStory, getStoryList } = require('../controller/story.controller')

const storyRouter = new Router({ prefix: '/story' })

// 创建故事
storyRouter.post('/', verifyToken, createStory)

// 获取故事列表
storyRouter.post('/list', verifyToken, getStoryList)

module.exports = storyRouter

