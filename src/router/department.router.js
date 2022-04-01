const Router = require("koa-router");

const { verifyToken } = require('../middleware/auth.middleware')
const { createDepartment, deleteDepartment, patchDepartment, getDepartMent, getDepartmentList } = require('../controller/department.controller')

const departmentRouter = new Router({ prefix: "/department" });

// 创建部门
departmentRouter.post('/', verifyToken, createDepartment)

// 删除部门
departmentRouter.delete('/:id', verifyToken, deleteDepartment)

// 更新部门
departmentRouter.patch('/:id', verifyToken, patchDepartment)

// 获取单个部门
departmentRouter.get('/:id', verifyToken, getDepartMent)

// 获取部门列表
departmentRouter.post('/list', verifyToken, getDepartmentList)

module.exports = departmentRouter