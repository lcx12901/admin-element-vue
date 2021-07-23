<template>
    <div class="order">
        <el-card class="container" shadow="hover">
            <el-table
                :data="ordersList"
                stripe
                border
                style="width: 100%">
                <el-table-column type="index" label="#" width="50" />
                <el-table-column prop="order_number" label="订单流水号" width="190"/>
                <el-table-column prop="order_fapiao_title" label="发票抬头" width="100"/>
                <el-table-column prop="order_price" label="订单价格" width="90
                
                "/>
                <el-table-column label="发货地址" width="180">
                    <template slot-scope="{row}">
                        <!-- {{eval(row.consignee_addr)}} -->
                        <span>{{row.consignee_addr || '无'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="支付方式" width="90">
                    <template slot-scope="{row}">
                        <el-tag size="mini" type="danger" v-if="row.order_pay == '0'">未支付</el-tag>
                        <el-tag size="mini" v-else-if="row.order_pay == '1'">支付宝</el-tag>
                        <el-tag size="mini" type="success" v-else-if="row.order_pay == '2'">微信</el-tag>
                        <el-tag size="mini" type="info" v-else-if="row.order_pay == '3'">银行卡</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="支付状态" width="90">
                    <template slot-scope="{row}">
                        <el-tag size="mini" type="danger" v-if="row.pay_status == '0'">未付款</el-tag>
                        <el-tag size="mini" type="success" v-else-if="row.pay_status == '1'">已支付</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" width="50">
                    <template slot-scope="{row}">
                        <el-tag size="mini" :type="row.is_send == '否' ? 'warning' : 'success'">{{row.is_send}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="更新时间" width="120">
                        <template slot-scope="{row}">
                            <span>{{row.update_time | formatDate}}</span>
                        </template>
                </el-table-column>
                <el-table-column label="操作">
                        <template slot-scope="{row}">
                            <el-button size="small" type="primary" @click="showChangeOrder(row)">修改订单</el-button>
                            <el-button size="small" type="info" plain @click="showOrder(row.id)">订单详情</el-button>
                            <el-button size="small" type="success" plain @click="showKuaidi(row.order_id)">物流信息</el-button>
                        </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="pagination"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="order_params.pagenum"
                :page-sizes="[3, 5, 10, 20]"
                :page-size="order_params.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <el-dialog 
            title="修改订单"
            @closed="closeChangeOrderDialog()"
            :visible.sync="changeOrderDialog"
        >
            <el-form :model="changeOrderForm" class="edit-user-form" label-position="right" label-width="200px">
                <el-form-item  label="订单是否发货:">
                    <el-radio-group 
                        v-model="changeOrderForm.is_send" 
                        :fill="getSend[0]"
                        :text-color="getSend[1]"
                        >
                        <el-radio-button label="否">未发货</el-radio-button>
                        <el-radio-button label="是">已经发货</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="订单支付方式：">
                    <el-radio-group 
                        v-model="changeOrderForm.order_pay" 
                        :fill="getPay[0]"
                        :text-color="getPay[1]"
                        >
                        <el-radio-button label="0">未支付</el-radio-button>
                        <el-radio-button label="1">支付宝</el-radio-button>
                        <el-radio-button label="2">微信</el-radio-button>
                        <el-radio-button label="3">银行卡</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="订单价格">
                    <el-input type="text" v-model="changeOrderForm.order_price" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="订单流水号">
                    <el-input type="text" v-model="changeOrderForm.order_number" autocomplete="off"></el-input>
                </el-form-item>
                <!-- <el-form-item  label="订单支付状态:">
                    <el-radio-group 
                        v-model="changeOrderForm.pay_status" 
                        :fill="getStatus[0]"
                        :text-color="getStatus[1]"
                        >
                        <el-radio-button label="0">未付款</el-radio-button>
                        <el-radio-button label="1">已付款</el-radio-button>
                    </el-radio-group>
                </el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeChangeOrderDialog">取 消</el-button>
                <el-button type="primary" @click="editOrder">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog 
            title="物流信息"
            @closed="closeKuaidiDialog()"
            :visible.sync="showKuaidiDialog"
        >
        </el-dialog>
    </div>
</template>

<script>
// import cityOptions from '@/js/city_data2017_element.js'
import {reqOrders, reqEditOrder, reqKuaidi} from 'network/api.js'
export default {
    name: 'Order',
    data () {
        return {
            order_params: {
                query: {},
                pagenum: 1,
                pagesize: 3
            },
            ordersList: [],
            total: 0,
            changeOrderDialog: false,
            changeOrderForm: {},
            sendFill: '',
            showKuaidiDialog: false
        }
    },
    created () {
        this.getOrders()
    },
    methods: {
        // 获取订单列表
        async getOrders () {
            const {data} = await reqOrders(this.order_params)
            this.total = data.total
            this.ordersList = data.goods
        },
        // 分页导航每页大小变化
        handleSizeChange (val) {
            this.order_params.pagesize = val
            this.getOrders()
        },
        // 分页导航页码变化
        handleCurrentChange (val) {
            this.order_params.pagenum = val
            this.getOrders()
        },
        // 显示修改订单dialog
        showChangeOrder (order) {
            const {order_id:id, is_send, order_pay, order_price, order_number} = order
            this.changeOrderForm = Object.assign({
                id,
                is_send,
                order_pay,
                order_price,
                order_number
            })
            this.changeOrderDialog = true
        },
        // 关闭修改订单dialog
        closeChangeOrderDialog () {
            this.changeOrderDialog = false
        },
        // 修改订单信息
        async editOrder () {
            const send_status = ['否', '是']
            this.changeOrderForm.is_send = send_status.indexOf(this.changeOrderForm.is_send)
            const {meta} = await reqEditOrder(this.changeOrderForm)
            if (meta.status != 201) return
            this.changeOrderDialog = false
            this.getOrders()
        },
        // 查看物流信息
        async showKuaidi () {
            const {data} = await reqKuaidi()
            this.kuaidi = data
            this.showKuaidiDialog = true
        },
        // 关闭物流信息dialog
        closedKuaidiDialog () {
            this.showKuaidiDialog = false
        }
    },
    computed: {
        // dialog中各单选框组的颜色变化
        getSend () {
            return this.changeOrderForm.is_send == '否' ? ['#fdf6ec', '#e6a23c'] : ['#f0f9eb', '#67c23a']
        },
        getPay () {
            if (this.changeOrderForm.order_pay == '0') return ['#fef0f0', '#f56c6c']
            if (this.changeOrderForm.order_pay == '1') return ['#ecf5ff', '#409EFF']
            if (this.changeOrderForm.order_pay == '2') return ['#f0f9eb', '#67c23a']
            if (this.changeOrderForm.order_pay == '3') return ['#fdf6ec', '#e6a23c']
            return false
        },
        getStatus () {
            return this.changeOrderForm.pay_status == '0' ? ['#fef0f0', '#f56c6c'] : ['#f0f9eb', '#67c23a']
        }
    }
}
</script>

<style lang="less">

</style>