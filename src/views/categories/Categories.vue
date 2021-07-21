<template>
    <div class="categories">
        <el-card class="container" shadow="hover">
            <el-button type="primary" class="add-btn" @click="showAddDiaolog()">添加分类</el-button>
            <zk-table :data="cateList" :columns="columns"
                :selection-type="false"
                :expand-type="false"
                show-index
                border
            >
                <template slot="isOk" slot-scope="{row}">
                    <i class="el-icon-success" style="color: greenyellow" v-if="!row.cat_deleted"></i>
                    <i class="el-icon-error" style="color: red" v-else></i>
                   </template>
                <template slot="order" slot-scope="{row}">
                    <el-tag size="mini" v-if="row.cat_level == 0">一级</el-tag>
                    <el-tag size="mini" type="success" v-else-if="row.cat_level == 1">二级</el-tag>
                    <el-tag size="mini" type="warning" v-else>三级</el-tag>
                </template>
                <template slot="opt">
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                </template>
            </zk-table>
            <!--分页-->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="cate_params.pagenum"
                :page-sizes="[3, 5, 10, 15]"
                :page-size="cate_params.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <el-dialog
            title="添加分类"
            @closed="closeAddDialog()"
            :visible.sync="addCateDialog"
        >
            <el-form :model="addCateForm" :rules="addCateRules" label-position="right">
                <el-form-item label="分类名称">
                    <el-input type="name" v-model="addCateForm.cat_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <el-cascader
                        v-model="categories"
                        :options="addCascader"
                        clearable
                        change-on-select
                        :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name' }"
                    >
                    </el-cascader>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import {reqCategories} from 'network/api.js'

export default {
    name: 'Categories',
    data () {
        return {
            cate_params:{ //请求参数的数据
                type:3,
                pagenum:1,
                pagesize:5
            },
            cateList: [],
            total: null,
            columns:[
                {
                    label: '分类名称',
                    prop:'cat_name'
                },
                {
                    label: '是否有效',
                    type:'template',
                    template:'isOk'
                },
                {
                    label: '排序',
                    type:'template',
                    template:'order'
                },
                {
                    label: '操作',
                    type:'template',
                    template:'opt'
                }
            ],
            addCateDialog: false,
            categories: [],
            addCascader: [],
            addCateForm: {
                cat_pid: 0,
                cat_name: '',
                cat_level: 0
                
            }
        }
    },
    created () {
        this.getCategories()
    },
    methods: {
        async getCategories () {
            const {data} = await reqCategories(this.cate_params)
            this.cateList = data.result
            this.total = data.total
        },
        // 每页大小变化
        handleSizeChange (val) {
            this.cate_params.pagesize = val
            this.getCategories()
        },
        // 页码变化
        handleCurrentChange (val) {
            this.cate_params.pagenum = val
            this.getCategories()
        },
        // 显示添加分类dialog
        async showAddDiaolog () {
            this.addCateDialog = true
            this.cate_params.type = 2
            const {data} = await reqCategories(this.cate_params)
            this.addCascader = data.result
            this.cate_params.type = 3
        },
    }
}
</script>

<style lang="less">
    .categories {

        .container {

            .add-btn {
                margin-bottom: 20px;
            }

            .el-pagination {
                margin-top: 20px;
            }
        }
    }
</style>