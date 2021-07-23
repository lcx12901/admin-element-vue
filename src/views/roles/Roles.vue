<template>
    <div class="roles">
        <el-card class="container" shadow="hover">
            <el-button type="primary" plain @click="showRoleDialog = true">添加角色</el-button>
            <el-table
                :data="rolesList"
                stripe
                border
                style="width: 100%">
                <el-table-column type="expand">
                    <template #default="{row}">
                        <el-row 
                            v-for="(item,index) in row.children" 
                            :key="item.id" :class="['al_center','bottom_border',index === 0? 'top_border' :'']"
                        > 
                            <el-col :span="6">
                                <el-tag closable @close="closeTagRights(row,item.id)">{{item.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="18">
                                <el-row :class="['al_center',index2 === 0 ? '': 'top_border']" v-for="(itemChild,index2) in item.children"
                                        :key="itemChild.id">
                                    <el-col :span="6">
                                        <el-tag type="success" @close="closeTagRights(row,itemChild.id)" closable>{{itemChild.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="16">
                                        <el-tag
                                                closable
                                                type="warning"
                                                v-for="itemGrandson in itemChild.children"
                                                :key="itemGrandson.id"
                                                @close="closeTagRights(row,itemGrandson.id)"
                                        >
                                            {{itemGrandson.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
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
                    <template slot-scope="{row}">
                        <el-button size="small" type="primary" icon="el-icon-edit" @click="showEditDialog(row)">编辑</el-button>
                        <el-button size="small" type="danger" icon="el-icon-delete" @click="deleteRole(row.id)">删除</el-button>
                        <el-button size="small" type="warning" icon="el-icon-setting" @click="updateRightsClick(row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog
            :title="dialogType ? '添加用户角色' : '编辑用户角色'"
            @closed="closeRoleDialog"
            :visible.sync="showRoleDialog"
        >
            <el-form 
                :model="RoleForm" 
                label-position="right" 
                :rules="roleRules" 
                ref="roleForm" 
                label-width="100px"
            >
                <el-form-item  label="角色名称:" prop="roleName">
                    <el-input type="text" v-model="RoleForm.roleName" ></el-input>
                </el-form-item>
                <el-form-item  label="角色描述:" prop="roleDesc">
                    <el-input type="text" v-model="RoleForm.roleDesc" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeRoleDialog">取 消</el-button>
                <el-button type="primary" @click="roleConfirm">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="分配角色权限"
            @closed="closeRightsDialog"
            :visible.sync="showRightDialog"
        >
            <el-tree
                :props="props"
                :data="rightsTree"
                default-expand-all
                show-checkbox
                node-key="id"
                :default-checked-keys="defaultKeys"
                ref="tree"
            >
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeRightsDialog">取 消</el-button>
                <el-button type="primary" @click="rightsConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {reqRoles, reqRights, reqDeleteRight, reqAddRole, reqEditRole, reqDeleteRole, reqAssignRights} from 'network/api.js'
export default {
    name: 'Roles',
    data () {
        return {
            rolesList: [],
            rightsTree: [],
            dialogType: 0,
            showRoleDialog: false, // 显示dialog
            editRoleId: 0, // 当前编辑的角色id
            RoleForm: {  // 角色编辑表单
                roleName: '',
                roleDesc: ''
            },
            roleRules: {
                roleName: [
                    {required: true, message: '请输入角色名称', trigger: 'blur'}
                ],
                roleDesc: [
                    {required: true, message: '请输入角色描述', trigger: 'blur'}
                ]
            },
            props: {
                children: 'children',
                label: 'authName'
            },
            showRightDialog: false,
            currentRole: 0, // 当前分配权限的角色id
            defaultKeys: []
        }
    },
    created () {
        this.getRoles()
        this.getRights()
    },
    methods: {
        // 获取角色列表
        async getRoles () {
            const {data} = await reqRoles()
            this.rolesList = data
        },
        // 获取角色权限树状列表
        async getRights () {
            const {data} = await reqRights('tree')
            this.rightsTree = data
        },
        // 点击tag删除权限
        async closeTagRights (row, rightId) {
            const {id:roleId} = row
            const {data, meta} = await reqDeleteRight(roleId, rightId)
            if (meta.status != 200) return row.children = data
            this.getRoles()
        },
        // 显示编辑用户角色dialog
        showEditDialog (role) {
            this.dialogType = 1
            this.showRoleDialog = true
            const {id:roleId, roleName, roleDesc} = role
            this.editRoleId = roleId
            this.RoleForm = {
                roleName,
                roleDesc
            }
        },
        // 关闭角色dialog
        closeRoleDialog () {
            this.RoleForm = {
                roleName: '',
                roleDesc: ''
            }
            this.showRoleDialog = false
        },
        // dialog提交按钮
        roleConfirm () {
            this.$refs['roleForm'].validate( async (valid) => {
                if (valid) {
                    let result
                    this.dialogType == 0 ? result = await reqAddRole(this.RoleForm) : result = await reqEditRole(this.editRoleId, this.RoleForm)
                    
                    const {meta} = result
                    const status = !this.dialogType ? 201 : 200
                    if (meta.status != status) return
                    this.showRoleDialog = false
                    this.roleForm = {
                        roleName: '',
                        roleDesc: ''
                    }
                    
                    this.getRoles()
                }
            })
        },
        // 删除用户角色
        async deleteRole (id) {
            const {meta} = await reqDeleteRole(id)
            if (meta.status != 200) return
            this.getRoles()
        },
        // 获取默认选中的节点
        getDefaultKeys (data, arr) {
            if (!data.children) return arr.push(data.id)
            data.children.forEach( item => {
                this.getDefaultKeys(item, arr)
            })
        },
        // 显示用户权限编辑dialog
        updateRightsClick (row) {
            this.currentRole = row.id
            this.getDefaultKeys(row, this.defaultKeys)
            this.showRightDialog = true
            
        },
        // 关闭用户权限编辑dialog
        closeRightsDialog () {
            this.showRightDialog = false
            this.defaultKeys = []
            
        },
        // 提交角色权限分配
        async rightsConfirm () {
            const rids = [...this.$refs.tree.getCheckedKeys(),...this.$refs.tree.getHalfCheckedKeys()].join(",")
            console.log(typeof rids)
            const {meta} = await reqAssignRights(this.currentRole,rids)
            if (meta.status != 200) return
            this.getRoles()
            this.showRightDialog = false
        }
    },
    computed: {

    }
}
</script>

<style lang="less">
    .container {
        .el-table {
            margin-top: 20px;

            .top_border {
                border-top: 1px solid #dddddd;
            }

            .bottom_border {
                border-bottom: 1px solid #dddddd;
            }
            .al_center{
                display: flex;
                align-items: center;
            }
            .el-tag {
                margin: 10px 10px;
            }
        }
    }
</style>