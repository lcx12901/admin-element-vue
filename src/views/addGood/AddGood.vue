<template>
    <div class="addGood">
        <el-card class="container" shadow="hover">
            <el-row>
                <el-col :span="24">
                    <div class="grid-content bg-purple-light">
                        <!-- 添加商品信息 -->
                        <i class="el-icon-info"></i>
                        请添加商品信息
                    </div>
                </el-col>
            </el-row>
            <el-steps class="steps" :active="+active" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form :model="addGoodForm" :rules="rules" label-position="top" ref="addGoodForm"> 
                <el-tabs tab-position="left" v-model="active" :before-leave="tabChange">
                    <el-tab-pane label="基本信息">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addGoodForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addGoodForm.goods_price" type="number" min="0"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addGoodForm.goods_weight" type="number" min="0"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addGoodForm.goods_number" type="number" min="0"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                                v-model="addGoodForm.goods_cat"
                                :options="cateList"
                                :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name' }"
                                @change="casChange"
                                >
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数">
                        <el-form-item 
                            class="attr-form-item" 
                            v-for="item in manyList" 
                            :key="item.attr_id" 
                            :label="item.attr_name"
                        >
                            <el-checkbox-group v-model="item.attr_vals" >
                                <el-checkbox 
                                    :label="val" 
                                    name="type" 
                                    v-for="(val,key) in item.attr_vals" 
                                    :key="key">
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性">
                        <el-form-item 
                            v-for="item in onlyList"
                            :key="item.attr_id" 
                            :label="item.attr_name"
                        >
                            <el-input type="text" v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片">
                        <el-upload
                            action="/api/private/v1/upload"
                            list-type="picture-card"
                            :headers="headers"
                            :on-preview="handlePictureCardPreview"
                            :on-success="uploadSuccess"
                            :on-remove="handleRemove">
                                <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容">
                        <div id="editor"></div>
                        <el-button type="primary" plain round size="medium" style="margin-top: 20px;" @click="addGood">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import {reqCategories, reqAttributes, reqAddGood} from 'network/api.js'
import E from 'wangeditor'
export default {
    name: 'AddGood',
    data () {
        return {
            active: 0,
            cateList: [], // 商品分类列表
            addGoodForm: {
                goods_name: '',
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                goods_cat:[], // 添加商品选择的分类
                pics: [],
                goods_introduce: '',
                attrs: []  // 商品的参数（数组），包含 `动态参数` 和 `静态属性`
            },
            manyList: [], // 动态参数
            onlyList: [], // 静态参数
            rules: {
                goods_name: [
                    {required: true, message: '请输入商品名称', trigger: 'blur'}
                ],
                goods_price: [
                    {required: true, message: '请输入商品价格', trigger: 'change'}
                ],
                goods_weight: [
                    {required: true, message: '请输入商品重量', trigger: 'change'}
                ],
                goods_number: [
                    {required: true, message: '请输入商品数量', trigger: 'change'}
                ],
                goods_cat: [
                    {required: true, message: '请输入商品分类', trigger: 'blur'}
                ]
            },
            fileList: [],
            headers: {
                Authorization: sessionStorage.getItem('token')
            },
            dialogImageUrl: '',
            dialogVisible: false,
            disabled: false
        }
    },
    created () {
        this.getCategories()
    },
    mounted () {
        const editor = new E(`#editor`)
        // 实时获取富文本信息
        editor.config.onchange = (newHtml) => {
            this.goods_introduce = newHtml
        }
        // 或者 const editor = new E( document.getElementById('div1') )
        editor.create()
    },
    methods: {
        // 获取商品分类列表
        async getCategories () {
            const {data} = await reqCategories()
            this.cateList = data
        },
        // 获取商品分类对应参数
        async getManyList () {
            const {data} = await reqAttributes(this.getCatId, 'many')
            data.forEach( item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : []
            })
            this.manyList = data
        },
        async getOnlyList () {
            const {data} = await reqAttributes(this.getCatId, 'only')
            this.onlyList = data
        },
        // 级联选择器改变，如果分类列表不足三个的，重新选择
        casChange () {
            if (this.addGoodForm.goods_cat.length != 3) return this.addGoodForm.goods_cat = []
        },
        tabChange (activeName, oldActiveName) {
            if (oldActiveName === '0' && this.addGoodForm.goods_cat.length !== 3) {
            this.$message.error("请先选择商品分类")
            return false
            }
            if (activeName === "1") {
                this.getManyList()
            } else if (activeName === "2") {
                this.getOnlyList()
            }
        },
        // 图片上传
        uploadSuccess (response) {
            const { data } = response
            this.addGoodForm.pics.push({pics: data.tmp_path})
        },
        // 图片移除
        handleRemove (file) {
            const {response} = file
            console.log(response.data.tmp_path)
            this.addGoodForm.pics = this.addGoodForm.pics.filter( item => item.pics != response.data.tmp_path)
            // console.log(fileList)
        },
        // 图片预览
        handlePictureCardPreview (file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        // 添加商品
        addGood () {
            this.$refs['addGoodForm'].validate( async (vaild, object) => {
                console.log(object)
                if (!vaild) {
                    Object.keys(object).forEach( item => this.$message.error(object[item][0].message))
                    
                    return
                }
                if (vaild) {
                    this.addGoodForm.goods_cat = this.addGoodForm.goods_cat.join(',')
                    this.manyList.forEach( item => {
                        this.addGoodForm.attrs.push({
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals.join(" ")
                        })
                    })
                    this.onlyList.forEach( item => {
                        this.addGoodForm.attrs.push({
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals
                        })
                    })
                    const {meta} = await reqAddGood(this.addGoodForm)
                    if (meta.status == 201) this.$router.back()
                }
            })
        }
    },
    computed: {
        getCatId () {
            return this.addGoodForm.goods_cat[2]
        }
    }
}
</script>

<style lang="less">
    .container {
        .el-row {
            .el-col {
                border-radius: 4px;

                .grid-content {
                    border-radius: 7px;
                    min-height: 36px;
                    text-align: center;
                    line-height: 36px;
                    color: #909399;
                    i {
                        margin-right: 5px;
                    }
                }
                .bg-purple-light {
                    background: #e5e9f2;
                }
            }
        }
        .steps {
            margin: 30px 0 10px 0;
        }

        // .el-form {

        //     .attr-form-item {
        //         display: flex;
        //         flex-direction: column;

        //         .el-form-item__label {
        //             text-align: left;
        //         }
        //         .el-form-item__content {
        //             min-height: 40px;
        //             margin-bottom: 30px;
        //         }
        //     }
        // }
    }
</style>