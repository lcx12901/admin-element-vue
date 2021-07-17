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
export const reqChangeState = (uId, type) => request({url: `users/${uId}/state/${type}`, method: 'put'});

// 添加用户
export const reqAddUser = (data) => request({url: '/users', method: 'post', data});

// 编辑用户提交
export const reqEditUser = (id,data) => request({url: `users/${id}`, method: 'put', data});

// 根据 ID 查询用户信息
export const reqUser = (id) => request({url: `users/${id}`});

// 删除用户
export const reqDelUser = (id) => request({url: `/users/${id}`, method: 'delete'});

// 请求用户角色列表
export const reqRoles = () => request({url: '/roles', method: 'get'});

// 分配用户角色
export const reqSetUserRole = (id,rid) => request({url: `users/${id}/role`, method: 'put', data: {rid}})