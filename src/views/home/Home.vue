<template>
    <div class="home">
        <el-container class="home-container">
            <el-header>
                <div class="header-logo">
                    <img src="~assets/logo.gif" alt="" srcset="">
                    <span>电商后台管理系统</span>
                </div>
                <el-button type="info" round @click="logout">退出</el-button>
            </el-header>
            <el-container>
                <el-aside :width="isShowMenu ? '64px' : '200px'">
                    <div class="showIcon">
                        <el-switch
                            style="display: block"
                            v-model="isShowMenu"
                            active-color="#ff4949"
                            inactive-color="#13ce66">
                        </el-switch>
                    </div>
                    <el-menu
                        router
                        :collapse="isShowMenu"
                        background-color="#333744"
                        text-color="#fff"
                        active-text-color="#3d9eff"
                        unique-opened
                        :collapse-transition="false"
                        :default-active="activeItem"
                    >
                        <el-submenu 
                            :index="item.path"
                            v-for="item in menus"
                            :key="item.id"
                        
                        >
                            <template slot="title">
                                <i :class="['iconfont',iconList[item.id]]"></i>
                                <span slot="title">{{item.authName}}</span>
                            </template>
                            <el-menu-item
                                v-for="child in item.children"
                                :key="child.id"
                                :index="`/${child.path}`"
                                @click="setActiveItem(child.path)"
                            >   
                                <template slot="title">
                                    <i class="el-icon-menu"></i>
                                    <span slot="title">{{child.authName}}</span>
                                </template>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <!-- 面包屑 导航栏 -->
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>{{getBreadcrumb[0]}}</el-breadcrumb-item>
                        <el-breadcrumb-item>{{getBreadcrumb[1]}}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <router-view></router-view>
                </el-main>

            </el-container>
        </el-container>
    </div>
</template>

<script>
import {reqMenus} from 'network/api.js'
export default {
    name: 'Home',
    data () {
        return {
            isShowMenu: false,
            activeItem: null,
            menus: [],
            sequenceMenu: [],
            iconList: {
                '125': 'icon-yonghu',
                '103': 'icon-quanxian',
                '101': 'icon-shangpinguanli',
                '102': 'icon-dingdan',
                '145': 'icon-shuju'
            }
        }
    },
    created () {
        this.getMenu()
        this.activeItem = this.$route.path
    },
    methods: {
        // 退出登录
        logout () {
            sessionStorage.clear()
            this.$router.push('/login')
        },
        // 获取左侧菜单
        async getMenu () {
            const {data} = await reqMenus()
            this.menus = data
           
        },
        // 点击侧边栏激活当前路由
        setActiveItem (path) {
            this.activeItem = `/${path}`
        }
    },
    computed: {
        getBreadcrumb () {
            const path = this.$route.path
            if (path == '/users') return ['用户管理', '用户列表']
            if (path == '/roles') return ['权限管理', '角色列表']
            if (path == '/rights') return ['权限管理', '权限列表']
            if (path == '/goods') return ['商品管理', '商品列表']
            if (path == '/goods/addGood') return ['商品管理', '添加商品']
            if (path == '/params') return ['商品管理', '分类参数']
            if (path == '/categories') return ['商品管理', '商品分类']
            if (path == '/orders') return ['订单管理', '订单列表']
            if (path == '/reports') return ['数据统计', '数据报表']
            return ['你在哪', '我又在哪']
        }
    }
}
</script>

<style lang="less">
    .home {
        height: 100%;
        .home-container {
            height: 100vh;

            .el-header {
                background-color: #373d41;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .header-logo {
                    display: flex;
                    align-items: center;

                    img {
                        height: 55px;
                        width: 55px;
                    }
                    span {
                        color: #fff;
                        font-size: 20px;
                        margin-left: 20px;
                    }
                }
            }

            .el-aside{
                background-color: #333744;
                user-select: none;

                .showIcon {
                    padding: 5px 10px
                }

                .iconfont {
                    margin-right: 10px;
                }
                
                .el-menu {
                    border-right: none;
                }
            }

            .el-main{
                background-color: #eaedf1;

            .container {
                margin-top: 20px;
                border-radius: 20px;

                .search {
                    .input-item {
                        width: 30%;

                        div {
                            width: 100%;
                        }
                    }
                }
                .pagination {
                    margin-top: 20px;
                }
            }
            }
        }
    }
</style>