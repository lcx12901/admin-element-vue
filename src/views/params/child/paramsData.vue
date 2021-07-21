<template>
    <div>
        <el-button type="primary" plain :disabled="this.chooseCate.length !== 3 ? true : false" @click="showDialog">{{getTabName}}</el-button>
        <el-table
            :data="cateTable"
            style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="{row}">
                    <json-viewer :value="row" copyable boxed></json-viewer>
                    <el-tag
                        :key="index"
                        v-for="(tag,index) in row.attr_vals"
                        closable
                        disable-transitions
                        @close="handleClose(tag, row)">
                        {{tag}}
                    </el-tag>
                    <el-input
                        class="input-new-tag"
                        v-if="row.inputVisible"
                        v-model="row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(row)"
                        @blur="handleInputConfirm(row)"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ New Tag</el-button>
                </template>
            </el-table-column>
            <el-table-column
                label="#"
                type="index"
                width="50">
            </el-table-column>
            <el-table-column
                :label="tabActive == 'many' ? '参数名称' : '静态名称'"
                prop="attr_name">
            </el-table-column>
            <el-table-column
                label="操作"
            >
                <template slot-scope="{row}">
                    <el-button type="primary" plain icon="el-icon-edit" @click="editAttr(row)">编辑</el-button>
                    <el-button type="danger" plain icon="el-icon-delete" @click="deleteAttr(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            :title="dialog.title"
            :visible.sync="dialog.dialogVisible"
        >
            <el-form label-position="left" :model="editAttrForm" :rules="editAttrRules" ref="editAttrForm">
                <el-form-item :label="getTabName" prop="attr_name">
                    <el-input type="text" v-model="editAttrForm.attr_name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closed()">取 消</el-button>
                <el-button type="primary" @click="editAttrConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import JsonViewer from 'vue-json-viewer'
import {reqAddAttributes, reqEditAttributes, reqDeleteAttributes} from 'network/api.js'
export default {
    name: 'ParamsData',
    components: {
        JsonViewer
    },
    props: {
        tabActive: {
            type: String
        },
        chooseCate: {
            type: Array,
            default () {
                return []
            }
        },
        cateTable: {
            type: Array,
            default () {
                return []
            }
        },
        getAttributes: {
            type: Function,
            default () {
                return function () {

                }
            }
        }
    },
    data () {
        return {
            dialog: {
                title: '',
                dialogVisible: false
            },
            editAttrForm: {
                id: '',  // cat_id
                attrId: '',
                attr_name: '',
                attr_sel: ''
            },
            confirmType: 'edit',
            editAttrRules: {
                attr_name: [
                    {required: true, message: '请输入分类名称', trigger: 'blur'}
                ]
            }
        }
    },
    created () {

    },
    methods: {
        // 删除tag
        async handleClose (tag, row) {
            const index = row.attr_vals.indexOf(tag)
            row.attr_vals.splice(index, 1);
            const {cat_id:id, attr_id:attrId, attr_name, attr_sel, attr_vals} = row
            const data = {
                id,
                attrId,
                attr_name,
                attr_sel,
                attr_vals: attr_vals.join(" ")
            }
            const {meta} = await reqEditAttributes(data)
            if (meta.status != 200) row.attr_vals.split(index, 0, tag)
        },

        // tag标签编辑
        showInput (row) {
            row.inputVisible = true
            this.$nextTick( () => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        // 提交tag标签内容
        async handleInputConfirm (row) {
            let {cat_id:id, attr_id:attrId, attr_name, attr_sel, attr_vals, inputValue} = row
            if (inputValue) {
                attr_vals.push(inputValue)
                const data = {
                    id,
                    attrId,
                    attr_name,
                    attr_sel,
                    attr_vals: attr_vals.join(" ")
                }
                const {meta} = await reqEditAttributes(data)
                if (meta.status != 200) return attr_vals.pop()
                row.inputVisible = false
                row.inputValue = ''
            }
        },

        // 添加动态参数或者静态属性
        showDialog () {
            this.dialog.title = this.tabActive == 'many' ? '添加动态参数' : '添加静态属性'
            this.confirmType = 'add'
            this.dialog.dialogVisible = true
            this.editAttrForm.id = this.chooseCate[2]
            this.editAttrForm.attr_sel = this.tabActive
            this.editAttrForm.attr_name = ''
        },

        // 关闭dialog
        closed () {
            this.dialog.dialogVisible = false
        },

        // 编辑动态参数或静态属性
        editAttr (row) {
            const {attr_name, attr_id:attrId} = row
            this.showDialog()
            this.editAttrForm.attr_name = attr_name
            this.editAttrForm.attrId = attrId
            this.confirmType = 'edit'
        },

        // 提交编辑参数
        editAttrConfirm () {
            this.$refs['editAttrForm'].validate( async (valid) => {
                if (valid) {
                    if (this.confirmType == 'add') {
                        const {meta} = await reqAddAttributes(this.editAttrForm)
                        if ( meta.status != 201 ) return

                    }
                    if (this.confirmType == 'edit') {
                        const {meta} = await reqEditAttributes(this.editAttrForm)
                        if (meta.status != 200) return
                    }
                    this.dialog.dialogVisible = false
                    this.getAttributes()
                }
            })

        },

        // 删除动态参数或静态属性
        async deleteAttr (row) {
            const {cat_id:id, attr_id:attrId} = row
            const {meta} = await reqDeleteAttributes(id, attrId)
            if (meta.status != 200) return
            this.getAttributes() 
        }
    },
    watch: {
        tabActive: function (newVal) {
            this.tabActive = newVal
        },
        chooseCate: function (newVal) {
            if (newVal.length != 3) this.cateTable = []
        }
    },
    computed: {
        getTabName () {
            return this.tabActive == 'many' ? '动态参数' : '静态属性'
        }
    }
}
</script>

<style lang="less">
    .el-tag + .el-tag {
        margin-left: 10px;
        margin-top: 20px;
    }
    .button-new-tag {
        margin-left: 10px;
        margin-top: 20px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        margin-top: 20px;
        vertical-align: bottom;
    }
</style>