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
            <el-form :model="addCateForm" :rules="addCateRules" label-position="left" ref="addCateForm">
                <el-form-item label="分类名称" prop="cat_name">
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
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="addCategories">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {reqCategories, reqAddCategories} from 'network/api.js'

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
            categories: [],  // 选中的商品分类
            addCascader: [], // 商品分类级联选择器
            addCateForm: {
                cat_pid: 0,
                cat_name: '',
                cat_level: 0
            },
            addCateRules: {
                cat_name: [
                    {required: true, message: '请输入分类名称', trigger: 'blur'}
                ]
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
            const {data} = await reqCategories({type: 2})
            this.addCascader = data
        },
        // 关闭添加分类的dialog
        closeDialog () {
            this.addCateDialog = false  // 关闭dialog
            this.addCateForm = {  // 初始化表单
                cat_pid: 0,
                cat_name: '',
                cat_level: 0
            }
            this.categories = []  // 清空商品分类选中列表
        },
        // 添加商品分类
        addCategories () {
            this.$refs['addCateForm'].validate( async (valid) => {
                if (valid) {
                    this.addCateForm.cat_pid = this.categories.length == 0 ? 0 : this.categories[this.categories.length - 1]
                    this.addCateForm.cat_level = this.categories.length
                    const {meta} = await reqAddCategories(this.addCateForm)
                    if (meta.status != 201) return
                    this.getCategories()
                    this.addCateDialog = false
                }
            })
        }
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