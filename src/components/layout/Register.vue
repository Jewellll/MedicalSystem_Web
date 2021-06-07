<template>
    <div>
        <el-form :model="regForm" :rules="rules" ref="regForm" class="reg-container" label-position="left"
                 label-width="0x">
            <h3 class="check_title">注册</h3>
            <el-form-item prop="phoneNum">
                <el-input type="text" v-model="phoneNum"
                          auto-complete="off" placeholder="请输入手机号码"></el-input>
            </el-form-item>
            <el-form-item>
                <div class="iden">
                    <el-input type="text" v-model="verifyNum" style=""
                              auto-complete="off" @keyup.enter.native="verificationCode"
                              placeholder="请输入验证码"></el-input>
                    <el-button :style="{border: none,background:btnColor?'#2E9AFE':'#617079',color:'#FFF',width:'50%'}"
                               v-on:click="sendSmsCode"
                               class="verify-btn" v-model="btnContent"
                               v-bind="{'disabled':disabled}">
                        {{ btnContent }}
                    </el-button>
                </div>
            </el-form-item>
            <el-form-item prop="username">
                <el-input type="text" v-model="regForm.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item prop="email">
                <el-input type="text" v-model="regForm.email" placeholder="邮箱"></el-input>
            </el-form-item>
            <el-form-item  prop="newPassword">
                <el-input type="password" v-model="regForm.newPassword" placeholder="新密码"></el-input>
            </el-form-item>
            <el-form-item prop="checkPassword">
                <el-input type="password" v-model="regForm.checkPassword" placeholder="确认新密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width: 100%;border: none"
                           v-on:click.stop="verificationCode">
                    确定
                </el-button>
            </el-form-item>
            <el-link :underline="false" class="back-link" @click="back()">返回</el-link>
        </el-form>
    </div>
</template>

<script>
import {editUserInfo, requestLogin, requestMss, requireRegister} from '../../api/api'

export default {
    name: 'Register',
    data () {
        var validatePass = (rule, value, callback) => {
            if (!value) {
                callback(new Error("请输入新密码"));
            } else if (value.toString().length < 6 || value.toString().length > 18) {
                callback(new Error("密码长度为6-18位"));
            } else {
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value !== this.regForm.newPassword) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        return {
            regForm: {
                username:"",
                email:"",
                newPassword:"",
                checkPassword:""
            },
            rules: {
                username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
                newPassword: [{ validator: validatePass, trigger: "blur" }],
                checkPassword: [{ validator: validatePass2, trigger: "blur" }]
            },
            phoneNum: '', //手机号
            verifyNum: '', //验证码
            btnContent: '获取验证码', //获取验证码按钮内文字
            time: 0, //发送验证码间隔时间
            disabled: false, //按钮状态
            btnColor: true
        }
    },
    created () {

    },
    methods: {
        // 获取验证码
        sendSmsCode () {
            var reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$///手机号正则验证
            var phoneNum = this.phoneNum
            if (!phoneNum) {//未输入手机号
                this.$message({
                    message: '手机号不能为空',
                    center: true
                })
                return
            }
            if (!reg.test(phoneNum)) {//手机号不合法
                this.$message({
                    message: '手机号格式不正确',
                    center: true
                })
                return
            }
            this.time = 60
            this.btnColor = false
            this.timer()
            获取验证码请求
            const phoneParams={phoneNum: this.phoneNum}
            requestMss(phoneParams).then(data => {
                let {msg, code, user, token} = data;
                if (code === 200) {
                    this.$message('发送成功')
                } else if (code === 400) {
                    this.$message.error("发送失败");
                }
            });
            // this.$http
            //     .post('/send', {
            //         phoneNum: this.phoneNum,
            //     })
            //     .then(res => {
            //         if (res.data.code === 200) {
            //             this.$message('发送成功')
            //         }
            //         if (res.data.code === 400) {
            //             this.$message.error("发送失败");
            //         }
            //     })
            //     .catch(failResponse => {});
        },
        timer () {
            if (this.time > 0) {
                this.time--
                this.btnContent = this.time + 's后重新获取'
                this.disabled = true
                var timer = setTimeout(this.timer, 1000)
            } else if (this.time == 0) {
                this.btnContent = '获取验证码'
                clearTimeout(timer)
                this.disabled = false
                this.btnColor = true
            }
        },
        // 验证验证码
        verificationCode () {
            this.$refs.regForm.validate((valid) => {
                if (valid) {
                    const regParams = { phoneNum: this.phoneNum,
                        verifyNum: this.verifyNum,
                        username: this.regForm.username,
                        password:this.regForm.newPassword,
                        email: this.regForm.email}
                     requireRegister(regParams).then(data => {
                        this.logining = false
                        let {msg, code, user, token} = data
                        if (code !== 200) {
                            this.$message.error("注册失败");
                        } else {
                            this.$message('注册成功')
                            var path = this.$route.query.redirect
                            this.$router.replace({
                                path: path === '/' || path === undefined ? '/login' : path
                            });
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        back(){
            this.$router.push({ path: "/login", query: {} });
        }
    }
}
</script>

<style scoped>
.iden {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
}

.reg-container {
    border-radius: 15px;
    margin-left:auto;
    margin-right: auto;
    margin-top: 0px;
    width: 350px;
    padding: 0px 35px 8px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    opacity: 0.9;
}
.back-link {
    position: relative;
    left: 180px;
    color: #505458;
    font-size: 13px;
}
</style>
