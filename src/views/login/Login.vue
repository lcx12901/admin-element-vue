<template>
    <div class="login">
        <div class="container blur">
            <div class="logo blur">
                <img :src="require('@/assets/logo.png')" alt="" srcset="">
            </div>
            <el-form class="login-form" :model="ruleForm" status-icon :rules="rules" ref="ruleForm">
                <el-form-item prop="name">
                    <el-input type="text" v-model="ruleForm.name" prefix-icon="iconfont icon-yonghu"></el-input>
                </el-form-item>
                <el-form-item prop="pass">
                    <el-input type="password" v-model="ruleForm.pass" prefix-icon="iconfont icon-mima"></el-input>
                </el-form-item>
                <el-form-item class="login-btn">
                    <el-button type="primary" plain round @click="submitForm('ruleForm')">登录</el-button>
                    <el-button type="info" plain round @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import {reqLogin} from 'network/api.js'
export default {
    name: 'Login',
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

        return {
            ruleForm: {
                name: '',
                pass: '',
            },
            rules: {
                name: [
                    {validator: checkName, trigger: 'blur'}
                ],
                pass: [
                    { validator: checkPass, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate( async (valid) => {
            if (valid) {
                const {name:username, pass:password} = this.ruleForm
                const result = await reqLogin({username, password})
                if (result) {
                    sessionStorage.setItem('token', result.token)
                    this.$router.push('/welcome')
                }
            } else {
                this.$message({
                    showClose: true,
                    message: '登录验证失败',
                    type: 'error',
                    center: true
                })
            }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
}
</script>

<style lang="less">
    .login {
        position: relative;
        background: url('~assets/back.jpg') no-repeat;
        background-size: 100% 100%;
        height: 100vh;

        .blur {
            background: hsla(0, 0%, 100%, .75);
            -webkit-backdrop-filter: blur(5px);    
            backdrop-filter: blur(5px);
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        }
        .container {
            position: absolute;
            display: flex;
            flex-direction: column;
            align-items: center;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 450px;
            height: 300px;
            box-sizing: border-box;
            border-radius: 15px;

            .logo {
                position: absolute;
                display: flex;
                width: 150px;
                height: 150px;
                left: 50%;
                transform: translate(-50%, -50%);
                border-radius: 100%;
                

                img {
                    display: block;
                    width: 130px;
                    height: 130px;
                    margin: 10px auto;
                    border-radius: 100%;
                }
            }

            .login-form {
                position: absolute;
                bottom: 0;
                padding: 0 20px;
                width: 100%;

                .login-btn {
                    text-align: right;
                }

            }
        }
    }
</style>