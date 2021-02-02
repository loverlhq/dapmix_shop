<template>
    <div class="login_container">
        <div class="login_box">
            <!-- head icon -->
            <div class="avater_box"> 
                <img src="../assets/logo.png" alt="" srcset="">
            </div>
            <!-- login form -->
            <el-form class="login_form" :model="loginForm" label-width="6rem" :rules="rules" ref="loginFormRef" status-icon>
                <el-form-item label="账户" prop='username'>
                    <el-input placeholder="请输入你的账户名" prefix-icon="el-icon-user" v-model="loginForm.username" prop="username" ></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input  placeholder="请输入你的密码" v-model="loginForm.password" show-password prefix-icon="el-icon-lock" ></el-input>
                </el-form-item>

                <el-form-item class="btns">
                    <el-button type="primary" @click="loginFunc('loginFormRef')" plain>登录</el-button>
                    <el-button type="info" @click="resetForm('loginFormRef')" plain>重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('密码不能为空'))
                } else if (value.length < 6) {  
                    callback(new Error('请输入6位以上密码'))
                } else {
                    callback()
                }
            }

            return {
                loginForm: {
                    username: 'admin',
                    password: '123456'
                },
                rules: {
                    username: [
                        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { validator: validatePass, trigger: 'blur' }
                    ]
                }
            }
        },

        methods: {
            async loginFunc(formName) {
                this.$refs[formName].validate(async valid => {
                    if (valid) {
                        const { data: res } = await this.$http.post('login', this.loginForm)
                        if (res.meta.status === 200) {
                            this.successMsg()
                            window.sessionStorage.setItem('token', res.data.token)
                            this.$router.push('/home')
                        } else if (res.meta.status === 400) {
                            this.warningMsg()
                        }
                    }
                })
            },

            resetForm(formName) {
                if (this.$refs[formName] !== undefined) {
                    this.$refs[formName].resetFields()
                }
            },

            successMsg() {
                this.$message({
                    message: '登录成功',
                    showClose: true,
                    center: true,
                    type: 'success'
                })
            },
            warningMsg() {
                this.$message({
                    message: '用户名或密码错误',
                    showClose: true,
                    center: true,
                    type: 'warning'
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .login_container{
        height: 100%;
        background-color: #2b4b6b;
    }
    .login_box{
        width: 40rem;
        height: 30rem;
        background-color: white;
        border-radius: .5rem;
        position: absolute;
        top: calc(50% - 15rem);
        left: calc(50% - 20rem);
    }
    .avater_box{
        padding: 1rem;
        width: 10rem;
        height: 10rem;
        border: .5rem solid #eeeeee;
        border-radius: 50%;
        background-color: #fff;
        box-shadow: 0 0 1rem  #eeeeee;
        position: absolute;
        top: calc(50% - 6rem);
        left: -6rem;
        img {
            width: 100%;
            height:100%;
            border-radius: 50%;
            background-color: #eeeeee;
        }
    }

    .btns{
        display: flex;
        justify-content: flex-end;
    }
    .login_form{
        position: absolute;
        top: 11rem;
        right: 3rem;
        width: 30rem;
    }
</style>