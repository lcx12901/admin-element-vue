// 接口
// import Vue from 'vue'
import { request } from "./request";

// 登录
export const reqLogin = (data) => request({url: '/login', method: 'post', data});

//请求左侧侧边栏菜单
export const reqMenus = () => request({url:'/menus'});

//请求用户
export const reqUsers = (params) => request({url: '/users', params});

// 修改用户状态  users/:uId/state/:type
export const reqChangeState = (uId, type) => request({url: `/users/${uId}/state/${type}`, method: 'put'});

// 添加用户
export const reqAddUser = (data) => request({url: '/users', method: 'post', data});

// 编辑用户提交
export const reqEditUser = (id,data) => request({url: `/users/${id}`, method: 'put', data});

// 根据 ID 查询用户信息
export const reqUser = (id) => request({url: `/users/${id}`});

// 删除用户
export const reqDelUser = (id) => request({url: `/users/${id}`, method: 'delete'});

// 请求用户角色列表
export const reqRoles = () => request({url: '/roles', method: 'get'});

// 添加用户角色
export const reqAddRole = (data) => request({url: '/roles', method: 'post', data});

// 编辑用户角色
export const reqEditRole = (id, data) => request({url: `/roles/${id}`, method: 'put', data});

// 删除用户角色
export const reqDeleteRole =(id) => request({url: `/roles/${id}`, method: 'delete'});

// 分配用户角色
export const reqSetUserRole = (id,rid) => request({url: `/users/${id}/role`, method: 'put', data: {rid}});

// 所有权限列表
export const reqRights = (type) => request({url: `/rights/${type}`});

// 删除角色对应权限
export const reqDeleteRight = (roleId, rightId) => request({url: `roles/${roleId}/rights/${rightId}`, method: 'delete'});

// 分配角色权限
export const reqAssignRights = (roleId, rids) => request({url: `roles/${roleId}/rights`, method: 'post', data: {rids}});

// 商品列表数据
export const reqGoods = (params) => request({url: '/goods', params});

// 根据id查询商品
export const reqGood = (id) => request({url: `/goods/${id}`});

// 获取商品分类
export const reqCategories = (params) => request({url: '/categories', params});

// 添加商品分类
export const reqAddCategories = (data) => request({url: '/categories', method: 'post', data});

// 编辑商品分类
export const reqEditCategories = (id, cat_name) => request({url: `/categories/${id}`, method: 'put', data: {cat_name}});

// 删除商品分类
export const reqDeleteCategories = (id) => request({url: `categories/${id}`, method: 'delete'});

// 获取商品分类对应参数  categories/:id/attributes
export const reqAttributes = (id, sel) => request({url: `/categories/${id}/attributes`, params: {sel}});

// 添加动态参数或者静态属性
export const reqAddAttributes = (data) => request({url: `/categories/${data.id}/attributes`, method: 'post', data});

// 编辑参数或属性
export const reqEditAttributes = (data) => request({url: `categories/${data.id}/attributes/${data.attrId}`, method: 'put', data});

// 删除参数
export const reqDeleteAttributes = (id, attrId) => request({url: `categories/${id}/attributes/${attrId}`, method: 'delete'});

// 添加商品
export const reqAddGood = (data) => request({url: '/goods', method: 'post', data});

// 删除商品
export const reqDeleteGood = (id) => request({url: `/goods/${id}`, method: 'delete'});

// 编辑商品提交
export const reqEditGood = (data) => request({url: `/goods/${data.id}`, method: 'put', data});

// 获取订单列表
export const reqOrders = (params) => request({url: '/orders', params});

// 修改订单状态
export const reqEditOrder = (data) => request({url: `orders/${data.id}`, method: 'put', data});

// 查看订单详情
export const reqOrderInfo = (id) => request({url: `orders/${id}`}); 

// 查看物流信息
export const reqKuaidi = (id) => request({url: `/kuaidi/${id}`});
// reports/type/1
export const reqReport = () => request({url: '/reports/type/1'});
