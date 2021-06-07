<template>
    <div>
    <el-form :model="loginForm" :rules="rules" ref="loginForm" class="login-container" label-position="left"
             label-width="0x">
        <h3 class="login_title">登录</h3>
        <el-form-item prop="username">
            <el-input type="text" v-model="loginForm.username"
                      auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password"
                      auto-complete="off" @keyup.enter.native="login()" placeholder="密码"></el-input>
        </el-form-item>

        <el-form-item  prop="verifycode">
            <el-input v-model="loginForm.verifycode" placeholder="请输入验证码" class="identifyInput"></el-input>
        </el-form-item>
        <el-form-item>
            <div class="identifyBox">
                <div @click="refreshCode">
                    <Identify :identifyCode="identifyCode"></Identify>
                </div>
                <el-button @click="refreshCode" type='text' class="textbtn">看不清，换一张</el-button>
            </div>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" :loading="logining" style="width: 100%;background: #2E9AFE;border: none" @click="login()">
                登录
            </el-button>
        </el-form-item>
        <el-link :underline="false" class="forget-link" @click="forgetPassword()">忘记密码</el-link>
        <el-link :underline="false" class="phone-link" @click="phoneLogin()"><i class="el-icon-mobile-phone"></i>手机登录</el-link>
        <el-link :underline="false" class="signup-link" @click="register()">注册账号</el-link>
    </el-form>
    </div>
</template>
<script>
import Identify from './Identify'
import {requestLogin} from '../../api/api'
export default {
    name: 'Login',
    data () {
        const validateVerifycode = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入验证码'))
            } else if (value !== this.identifyCode) {
                console.log('validateVerifycode:', value)
                callback(new Error('验证码不正确!'))
            } else {
                callback()
            }
        };
        return {
            logining: false,
            loginForm: {
                username: '',
                password: '',
                verifycode: ''
            },
            checked: false,
            identifyCodes: '1234567890',
            identifyCode: '',
            rules: {
                username: [
                    {required: true, message: '请输入用户名', trigger: 'blur'}
                ],
                password: [{required: true, message: '请输入密码', trigger: 'blur'}],
                verifycode: [
                    { required: true,  validator: validateVerifycode,trigger: 'blur' }
                ]
            }
        }
    },
    components:{
        Identify
    },
    mounted() {
        // 验证码初始化
        this.identifyCode = ''
        this.makeCode(this.identifyCodes, 4)
    },
    methods: {
        // 生成随机数
        randomNum(min, max) {
            return Math.floor(Math.random() * (max - min) + min)
        },
        // 切换验证码
        refreshCode() {
            this.identifyCode = ''
            this.makeCode(this.identifyCodes, 4)
        },
        // 生成四位随机验证码
        makeCode(o, l) {
            for (let i = 0; i < l; i++) {
                this.identifyCode += this.identifyCodes[
                    this.randomNum(0, this.identifyCodes.length)
                    ]
            }
            console.log(this.identifyCode)
        },
        login () {
            const _this = this
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.logining = true;
                    const loginParams = {username: this.loginForm.username, password: this.loginForm.password}
                    requestLogin(loginParams).then(data => {
                        this.logining = false;
                        let { msg, code, user,token } = data;
                        if (code == 300) {
                            this.$message.error(msg);
                        } else if(code==200){
                            _this.$store.commit('login', user);
                            _this.$store.commit('login2', token);
                            _this.$router.push({ path: '/home' });
                        }else if(code == 400){
                            this.$message.error(msg);
                        }
                    } );
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        forgetPassword(){
            this.$router.push({ path: "/checkphone", query: {} });
        },
        phoneLogin(){
            this.$router.push({ path: "/phoneLogin", query: {} });
        },
        register(){
            this.$router.push({ path: "/register", query: {} });
        }
    }
}
</script>

<style>
.login-container {
    border-radius: 15px;
    margin: 10px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    opacity: 0.9;
}

.login_title {
    margin: 0px auto 20px auto;
    text-align: center;
    color: #505458;
    letter-spacing: 10px
}

.forget-link {
    position: relative;
    right: 120px;
    color: #505458;
    font-size: 12px;
}
.phone-link {
    position: center;
    color: #505458;
    font-size: 12px;
}
.signup-link{
    position: relative;
    left: 120px;
    color: #505458;
    font-size: 12px;
}
.identifyBox{
    display: flex;
    justify-content: space-between;
    margin-top:7px;
}
</style>
