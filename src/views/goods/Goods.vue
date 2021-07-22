<template>
    <div class="goods">
        <el-card class="container" shadow="hover">
            <div>
                <!-- 数据搜索栏、添加用户功能 -->
                <el-form :inline="true" class="search">
                    <el-form-item  class="input-item">
                        <el-input v-model="query" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" plain @click="searchShop">查询</el-button>
                        <el-button type="primary" @click="$router.push('/goods/addGood')">添加商品</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 页面数据可视化表格 -->
            <el-table
                :data="goods"
                stripe
                border
                style="width: 100%">
                <el-table-column type="index" label="#" width="50" />
                <el-table-column prop="goods_name" label="商品名称" width="700" />
                <el-table-column prop="goods_price" label="商品价格（元）" width="130" />
                <el-table-column prop="goods_weight" label="重量（Kg）" />
                <el-table-column label="创建时间" width="150">
                    <template slot-scope="{row}">
                        <span>{{row.add_time | formatDate}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="{row}">
                        <el-button 
                            type="primary" 
                            icon="el-icon-edit" 
                            circle @click="$router.push({path:'/goods/editGood', query: {id: row.goods_id}})"
                        ></el-button>
                        <el-button 
                            type="danger" 
                            icon="el-icon-delete" 
                            circle @click="deleteGood(row.goods_id)"
                        ></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页导航 -->
            <el-pagination
                class="pagination"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagenum"
                :page-sizes="[10, 30, 60, 120]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
import { 
    reqGoods,
    reqDeleteGood
} from 'network/api.js'
export default {
    name: 'Goods',
    data () {
        return {
            // 搜索框绑定值
            query: '',
            goods: [],
            pagenum: 1,
            pagesize: 10,
            total: 0,
        }
    },
    created () {
        this.getGoods()
    },
    methods: {
        // 获取商品数据列表
        async getGoods () {
            const {data} = await reqGoods({
                query: this.query,
                pagenum: this.pagenum,
                pagesize: this.pagesize
            })
            this.goods = data.goods
            this.total = data.total
        },
        // 商品搜索
        searchShop () {
            this.pagenum = 1
            this.getGoods()
        },
        // 分页导航中page size变化
        handleSizeChange (val) {
            this.pagesize = val
            this.getGoods()
        },
        // 分页当前页发生变化
        handleCurrentChange (val) {
            this.pagenum = val
            this.getGoods()
        },
        // 删除商品
        async deleteGood(id) {
            const {meta} = await reqDeleteGood(id)
            if (meta.status == 200) this.getGoods()
        }  
    }
}
</script>

<style lang="less">

</style>