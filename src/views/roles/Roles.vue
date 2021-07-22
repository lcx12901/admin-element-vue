<template>
    <div class="roles">
        <el-card class="container" shadow="hover">
            <el-button type="primary" plain>添加角色</el-button>
            <el-table
                :data="rolesList"
                stripe
                border
                style="width: 100%">
                <el-table-column type="expand">
                </el-table-column>
                <el-table-column
                    type="index"
                    label="#"
                />
                <el-table-column
                    label="角色名称"
                    prop="roleName"
                />
                <el-table-column
                    label="角色描述"
                    prop="roleDesc"
                />
                <el-table-column
                    label="操作"
                >
                    <template>
                        <el-button size="small" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button size="small" type="danger" icon="el-icon-delete">删除</el-button>
                        <el-button size="small" type="warning" icon="el-icon-setting">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
import {reqRoles} from 'network/api.js'
export default {
    name: 'Roles',
    data () {
        return {
            rolesList: []
        }
    },
    created () {
        this.getRoles()
    },
    methods: {
        async getRoles () {
            const {data} = await reqRoles()
            this.rolesList = data
        }
    }
}
</script>

<style>

</style>