const Router = require('koa-router')

const { verifyToken }  = require('../middleware/auth.middleware')
const { createUser, deleteUser, patchUser, getUser, getUserList } = require('../controller/user.controller')

const usersRouter = new Router({ prefix: '/users' })

// 创建用户
usersRouter.post('/', verifyToken, createUser)

// 通过id删除用户
usersRouter.delete('/:id', verifyToken, deleteUser)

// 通过id修改用户
usersRouter.patch('/:id', verifyToken, patchUser)

// 通过id查询用户
usersRouter.get('/:id', verifyToken, getUser)
// 获取用户列表
usersRouter.post('/list', verifyToken, getUserList)

module.exports = usersRouter