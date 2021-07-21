<template>
    <div class="params">
        <el-card class="container" shadow="hover">
            <el-alert
                title="注意：只允许为第三级分类设置相关参数！"
                type="warning"
                :closable="false"
                show-icon>
            </el-alert>
            <el-row class="categories">
                <span>请选择商品分类：</span>
                <el-cascader
                    v-model="chooseCate"
                    :options="categories"
                    clearable
                    :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name' }"
                    @change="casChange"
                >
                </el-cascader>
            </el-row>
            <el-tabs v-model="tabActive" @tab-click="changeTab">
                <el-tab-pane label="动态参数" name="many">
                    <params-data 
                        :tabActive="tabActive"
                        :chooseCate="chooseCate"
                        :cateTable="cateTable"
                        @getAttributes="getAttributes"    
                    >
                    </params-data>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <params-data 
                        :tabActive="tabActive"
                        :chooseCate="chooseCate"
                        :cateTable="cateTable"
                        :getAttributes="getAttributes"
                    ></params-data>
                </el-tab-pane>
            </el-tabs>

        </el-card>
    </div>
</template>

<script>
import {reqCategories, reqAttributes} from 'network/api.js'


import ParamsData from './child/paramsData.vue'
export default {
    name: 'Params',
    components: {
        ParamsData
    },
    data () {
        return {
            categories: [],  // 商品分类
            chooseCate: [],
            tabActive: 'many',
            cateTable: [],

        }
    },
    created () {
        this.getCategories()
    },
    methods: {
        // 获取商品分类
        async getCategories () {
            const {data} = await reqCategories()
            this.categories = data
        },

        // 级联选择器改变，如果分类列表不足三个的，重新选择
        casChange () {
            if (this.chooseCate.length != 3) return this.chooseCate = []
            this.getAttributes()
        },

        // tab切换
        changeTab () {
            if (this.chooseCate.length != 3) return this.cateTable = []
            this.getAttributes()
        },

        // 获取动态参数或静态属性
        async getAttributes () {
            const {data} = await reqAttributes(this.chooseCate[2], this.tabActive)
            data.forEach( item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                item.inputVisible = false
                item.inputValue = ''
            })
            this.cateTable = data
            
        }
    },
}
</script>

<style lang="less">

    .params {
        .categories {
            margin: 20px 0;


        }
    }
</style>