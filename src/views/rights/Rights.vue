<template>
    <div class="rights">
        <el-card class="container" shadow="hover">
            <el-table
                :data="rightsList"
                stripe
                border
                style="width: 100%"
            >
                <el-table-column type="index">
                </el-table-column>
                <el-table-column
                    property="authName"
                    label="权限名称"
                >
                </el-table-column>
                <el-table-column
                    property="path"
                    label="路径"
                >
                </el-table-column>
                <el-table-column
                    label="权限等级"
                >
                    <template slot-scope="{row}">
                        <el-tag size="mini" v-if="row.level == '0'">一级</el-tag>
                        <el-tag size="mini" type="success" v-else-if="row.level == '1'">二级</el-tag>
                        <el-tag size="mini" type="warning" v-else>三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
import {reqRights} from 'network/api.js'
export default {
    name: 'Rights',
    data () {
        return {
            rightsList: []
        }
    },

    created () {
        this.getRights()
    },

    methods: {
        async getRights () {
            const {data} = await reqRights('list')
            this.rightsList = data
        }
    }
}
</script>

<style>

</style>