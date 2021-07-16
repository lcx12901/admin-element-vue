<template>
    <div class="users">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="user-container" shadow="hover">
              <el-table
                :data="users"
                stripe
                border
                style="width: 100%">
                    <el-table-column
                        type="index"
                        label="#"
                        width="50" 
                    />
                    <el-table-column
                        prop="username"
                        label="姓名"
                        width="180"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="email"
                        label="邮箱"
                        width="180">
                    </el-table-column>
                    <el-table-column
                            prop="mobile"
                            label="电话">
                    </el-table-column>
                    <el-table-column
                            prop="role_name"
                            label="角色名">
                    </el-table-column>
                    <el-table-column
                            prop="mg_state"
                            label="状态">
                            <template slot-scope="{row}">
                                <el-switch
                                        v-model="row.mg_state"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        @change="changeMgState(row.id)">
                                    </el-switch>
                            </template>
                    </el-table-column>
                    <el-table-column
                            label="操作">
                    </el-table-column>
                </el-table>
        </el-card>
    </div>
</template>

<script>
import {reqUsers} from 'network/api.js'
export default {
    name: 'Users',
    data () {
        return {
            pagenum: 1,
            pagesize: 3,
            users: []
        }
    },
    created () {
        this.getUsers()
    },
    methods: {
        async getUsers () {
            const {users} = await reqUsers({
                pagenum: this.pagenum, 
                pagesize: this.pagesize
            })
            this.users = users
        },
        changeMgState (id) {
            console.log('nnkj')
            this.$message({
                message: id,
                type: 'success'
            })
        }
    }
}
</script>

<style lang="less">
    .users {
        .user-container {
            margin-top: 20px;
            border-radius: 10px;
        }
    }
</style>