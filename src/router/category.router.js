const Router = require('koa-router')

const { verifyToken } = require('../middleware/auth.middleware')
const {
  creaetCategory,
  deleteCategory,
  patchCategory,
  getCategory,
  getCategoryList
} = require('../controller/category.controller')

const categoryRouter = new Router({ prefix: '/category' })

// 创建类别
categoryRouter.post('/', verifyToken, creaetCategory)

// 删除类别
categoryRouter.delete('/:id', verifyToken, deleteCategory)

// 更新类别
categoryRouter.patch('/:id', verifyToken, patchCategory)

// 获取单个类别
categoryRouter.get('/:id', verifyToken, getCategory)

// 获取类别列表
categoryRouter.post('/list', verifyToken, getCategoryList)

module.exports = categoryRouter

