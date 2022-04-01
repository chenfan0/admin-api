const Router = require('koa-router')

const { createMenu, deleteMenu, patchMenu, getMenu, getMenuList } = require('../controller/menu.controller')

const { verifyToken } = require('../middleware/auth.middleware')

const menuRouter = new Router({ prefix: '/menu' })

// 创建菜单
menuRouter.post('/', verifyToken, createMenu)

// 删除菜单
menuRouter.delete('/:id', verifyToken, deleteMenu)

// 修改菜单
menuRouter.patch('/:id', verifyToken, patchMenu)

// 获取单个菜单
menuRouter.get('/:id', verifyToken, getMenu)

// 获取菜单列表
menuRouter.post('/list', verifyToken, getMenuList)

module.exports = menuRouter

