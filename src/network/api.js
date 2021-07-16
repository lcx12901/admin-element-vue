// 接口
// import Vue from 'vue'
import { request } from "./request";

// 登录
export const reqLogin = (data) => request({url: '/login', method: 'post', data});

//请求左侧侧边栏菜单
export const reqMenus = () => request({url:'/menus',method:'get'});

//请求用户
export const reqUsers = (params) => request({url: 'users', params});