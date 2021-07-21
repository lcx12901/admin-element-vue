<template>
    <div class="users">
        <!-- 页面内容容器 -->
        <el-card class="container" shadow="hover">
            <div>
                <!-- 数据搜索栏、添加用户功能 -->
                <el-form :inline="true" class="search">
                    <el-form-item  class="input-item">
                        <el-input v-model="query" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" plain @click="searchQuery">查询</el-button>
                        <el-button type="primary" @click="visible.addUserForm = true">添加用户</el-button>
                    </el-form-item>
                </el-form>
                
            </div>
            <!-- 页面数据可视化表格 -->
            <el-table
                :data="users"
                stripe
                border
                style="width: 100%">
                <el-table-column type="index" label="#" width="50" />
                <el-table-column prop="username" label="姓名" width="180" />
                <el-table-column prop="email" label="邮箱" width="180" />
                <el-table-column prop="mobile" label="电话" />
                <el-table-column prop="role_name" label="角色名" />
                <el-table-column prop="mg_state" label="状态">
                        <template slot-scope="{row}">
                            <el-switch
                                    v-model="row.mg_state"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    @change="changeMgState(row)">
                                </el-switch>
                        </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="{row}">
                        <el-button type="primary" icon="el-icon-edit" circle @click="showEditDialog(row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle @click="showDelDialog(row.id)"></el-button>
                        <el-button type="info" icon="el-icon-setting" circle @click="showSettingDialog(row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页导航 -->
            <el-pagination
            class="user-pagination"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagenum"
                :page-sizes="[3, 5, 10, 20]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加用户dialog -->
        <el-dialog title="添加用户" @closed="closed('addUserForm')" :visible.sync="visible.addUserForm">
            <el-form :model="addUserForm" :rules="addUserRules"  ref="addUserForm">
                <el-form-item label="用户名" prop="username" class="dialog-form">
                    <el-input type="text" v-model="addUserForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" class="dialog-form">
                    <el-input type="password" v-model="addUserForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email" class="dialog-form">
                    <el-input type="password" v-model="addUserForm.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile" class="dialog-form">
                    <el-input type="password" v-model="addUserForm.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closed('addUserForm')">取 消</el-button>
                <el-button type="primary" @click="addUser('addUserForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑用户信息dialog -->
        <el-dialog title="编辑用户" @closed="closed('editUserForm')" :visible.sync="visible.editUserForm">
            <el-form :model="editUserForm" :rules="editUserRules" class="edit-user-form" ref="editUserForm">
                <el-form-item label="用户名" prop="username" class="dialog-form">
                    <el-input type="email" v-model="editUserForm.username" autocomplete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email" class="dialog-form">
                    <el-input type="email" v-model="editUserForm.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile" class="dialog-form">
                    <el-input type="email" v-model="editUserForm.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closed('editUserForm')">取 消</el-button>
                <el-button type="primary" @click="editUser('editUserForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 删除用户dialog -->
        <el-dialog 
            title="提示" 
            @closed="closeDelDialog()"
            class="del-dialog" 
            :visible.sync="visible.delUser.isShow"
            width="30%"
        >
            <el-row class="del-dialog-row">
                <i class="iconfont icon-jinggao"></i>
                <span>此操作将永久删除该用户，是否继续？</span>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeDelDialog">取 消</el-button>
                <el-button type="primary" @click="delUser">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 用户角色分配dialog -->
        <el-dialog 
            title="分配角色"
            class="setting-dialog"
            @closed="closeSettingDialog()"
            :visible.sync="visible.setUser.isShow"
            width="30%"
        >
            <el-row>
                <p>当前用户是：{{visible.setUser.user.username}}</p>
            </el-row>
            <el-row>
                <p>当前角色：{{visible.setUser.user.role_name}}</p>
            </el-row>
            <el-row type="flex">
                <p>分配新角色：</p>
                <el-select v-model="roleValue" clearable placeholder="请选择">
                    <el-option
                    v-for="item in roles"
                    :key="item.id"
                    :label="item.roleName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeSettingDialog">取 消</el-button>
                <el-button type="primary" @click="setUser">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    reqUsers,
    // reqUser, 
    reqAddUser, 
    reqChangeState, 
    reqEditUser, 
    reqDelUser,
    reqRoles,
    reqSetUserRole
} from 'network/api.js'
export default {
    name: 'Users',
    data () {
        // 验证信息需要callback（）返回
        var checkName = (rule, value, callback) => {
            if (value === '') {
            return callback(new Error('用户名不能为空'));
            }
            if (value.length < 3 || value.length > 10) {
                return callback(new Error('长度在 3 到 10 个字符'))
            }
            return callback()
        };
        var checkPass = (rule, value, callback) => {
            if (value === '') {
                return callback(new Error('请输入密码'));
            }
            if (value.length < 6 || value.length > 15) {
                return callback(new Error('长度在 6 到 15 个字符'))
            }
            return callback()
        };
        var checkMobileLen = (rule, value, callback) => {
            var reg = new RegExp(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/);
            if (!reg.test(value)) {
                return callback(new Error('请输入正确的手机号吗'));
            }
            return callback()
        }
        return {
            query: '',
            pagenum: 1,
            pagesize: 3,
            currentpage: 1,
            total: 0,
            // /user页面用户数据列表
            users: [],
            // 角色列表
            roles: [],
            roleValue: '',
            // 多个dialog可见统一列表
            visible: {
                addUserForm: false,
                editUserForm: false,
                delUser: {
                    isShow: false,
                    uId: 0
                },
                setUser: {
                    isShow: false,
                    user: {
                        id: 0,
                        username: '',
                        role_name: ''
                    }
                }
            },
            // 添加用户表单绑定
            addUserForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            // 添加用户信息校验
            addUserRules: {
                username: [
                    {validator: checkName, trigger: 'blur'}
                ],
                password: [
                    { validator: checkPass, trigger: 'blur' }
                ]
            },
            // 编辑用户表单绑定
            editUserForm: {
                id: '',
                username: '',
                email: '',
                mobile: ''
            },
            // 编辑用户信息值校验
            editUserRules: {
                email: [
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ],
                mobile: [
                    {required: true, message: '请输入手机号', trigger: 'blur'},
                    {validator: checkMobileLen, trigger: ['blur', 'change']}
                ]
            }
        }
    },
    created () {
        this.getUsers()
        this.getRoles()
    },
    methods: {
        // 获取用户数据列表
        async getUsers () {
            const {data} = await reqUsers({
                query: this.query,
                pagenum: this.pagenum, 
                pagesize: this.pagesize
            })
            this.users = data.users
            this.total = data.total
        },
        // 获取角色列表
        async getRoles () {
            const {data} = await reqRoles()
            this.roles = data
        },
        // 用户关键字搜索
        async searchQuery () {
            this.pagenum = 1
            this.getUsers()
        },
        // 添加用户
        addUser (formName) {
            this.$refs[formName].validate( async (valid) => {
                if (valid) {
                    const {meta} = await reqAddUser(this.addUserForm)
                    if (meta.status == 201) {
                        this.getUsers()
                        this.closed(formName)
                    }
                }
            })
        },
        // 关闭dialog
        closed (formName) {
            console.log(formName)
            if (formName) this.$refs[formName].resetFields()
            this.visible[formName] = false
        },
        // 修改用户登录权限
        async changeMgState (user) {
            const {username, id, mg_state:type} = user
            if ( username == 'admin' && sessionStorage.getItem('uid') != 500 ) {
                this.$message({
                    message: '无法修改管理员权限',
                    type: 'error'
                })
                user.mg_state = true
                return
            }
            const {meta} = await reqChangeState(id, type)
            if (meta.status == 401) user.mg_state = !user.mg_state
        },
        handleSizeChange(val) {
            this.pagesize = val
            this.getUsers()
        },
        handleCurrentChange(val) {
            this.pagenum = val
            this.getUsers()
        },
        // 显示编辑用户dialog
        showEditDialog (user) {
            const {username, id, email, mobile} = user
            console.log(username, id, email, mobile)
            this.visible.editUserForm = true
            this.editUserForm = {
                id,
                username,
                email,
                mobile
            }
        },
        // 用户编辑提交
        editUser (formName) {
            this.$refs[formName].validate( async (valid) => {
                if (valid) {
                    const {id, email, mobile} = this.editUserForm
                    const {meta} = await reqEditUser(id, {email, mobile})
                    if (meta.status != 200) return
                    this.getUsers()
                    this.closed(formName)
                }
            })
        },
        // 删除用户
        showDelDialog (uId) {
            this.visible.delUser.isShow = true
            this.visible.delUser.uId = uId
        },
        // 关闭删除用户的dialog
        closeDelDialog () {
            this.visible.delUser.isShow = false
        },
        // 删除用户操作
        async delUser () {
            const uId = this.visible.delUser.uId
            if (uId == 500) {
                this.$message({
                    message: '不能删除admin',
                    type: 'error'
                })
                this.visible.delUser.isShow = false
                return
            }
            if (sessionStorage.getItem('uid') == uId) {
                this.$message({
                    message: '您已被航空公司限行',
                    type: 'error'
                })
                this.visible.delUser.isShow = false
                return
            }
            const {meta} = await reqDelUser(this.visible.delUser.uId)
            this.visible.delUser.isShow = false
            if (meta.status != 200) return
            if (this.users.length == 1) {
                if (this.pagenum ==1) {
                    this.pagenum = 1
                } else {
                    this.pagenum -= 1
                }
            }
            this.getUsers()
        },
        // 打开角色分配dialog
        showSettingDialog(user) {
            const {id, username, role_name} = user
            this.visible.setUser = {
                isShow: true,
                user: {
                    id,
                    username,
                    role_name
                }
            }
        },
        // 关闭用户角色分配dialog
        closeSettingDialog () {
            this.visible.setUser.isShow = false
        },
        // 提交用户角色分配
        async setUser () {
            if (!this.roleValue) return this.$message({
                duration: 1000,
                message: '请为用户分配角色',
                type: 'error'
            })
            if (this.roleValue) {
                const {meta} = await reqSetUserRole(this.visible.setUser.user.id, this.roleValue)
                if (meta.status == 200) {
                    this.visible.setUser.isShow = false
                    this.getUsers()
                }
            }
        }
    }
}
</script>

<style lang="less">
    .users {


        .dialog-form {
            display: flex;
            justify-content: center;

            label {
                width: 80px;
                text-align: end;
            }
            .el-form-item__content {
                flex: 1;
            }
        }

        .del-dialog {

            .del-dialog-row {

                .icon-jinggao {
                    color: red;
                    font-size: 30px;
                }

                span {
                    font-size: 18px;
                    margin-left: 20px;
                }
            }
        }

        .setting-dialog {

            .el-row {
                margin-top: 15px;

                p {
                    font-size: 16px;
                    line-height: 40px;
                }
            }
        }
    }
</style>