<template>
    <div class="check-container">
        <h3 class="check_title">修改密码</h3>
        <el-form :model="checkForm" :rules="rules1" label-width="0px" ref="checkForm">
            <el-form-item  prop="email">
                    <el-input type="text" v-model="checkForm.email" auto-complete="off" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item  prop="verifyNum">
                    <div class="iden">
                        <el-input type="text" v-model="checkForm.verifyNum" style=""
                                  auto-complete="off"
                                  placeholder="请输入验证码"></el-input>
                        <el-button :style="{background:btnColor?'#2E9AFE':'#617079',color:'#FFF',width:'50%'}"
                                   v-on:click="sendSmsCode"
                                   class="verify-btn" v-model="btnContent"
                                   v-bind="{'disabled':disabled}">
                            {{ btnContent }}
                        </el-button>
                    </div>
            </el-form-item>
            <el-form-item  prop="newPassword">
                    <el-input type="password" v-model="checkForm.newPassword" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item  prop="checkPassword">
                    <el-input type="password" v-model="checkForm.checkPassword" placeholder="再次输入密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click.native=" back()">返回</el-button>
                <el-button type="primary" @click.native="verificationCode">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {editPwd, requestMss} from '../../api/api'

export default {
    data () {
        var checkEmail = (rule, value, cb) => {
            // 验证邮箱的正则表达式
            const regEmail = /^[A-Za-z0-9]+([_.][A-Za-z0-9]+)*@([A-Za-z0-9-]+\.)+[A-Za-z]{2,6}$/

            if (regEmail.test(value)) {
                // 合法的邮箱
                return cb()
            }

            cb(new Error('请输入合法的邮箱'))
        };
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
            } else if (value !== this.checkForm.newPassword) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        return {
            checkForm:{
                verifyNum:"",
                email:"",
                newPassword:"",
                checkPassword:"",
            },
            rules1:{
                verifyNum: [{ required: true, message: "请输入验证码", trigger: "blur" }],
                email: [{ required: true, message: "请输入邮箱", trigger: "blur" },
                    { validator: checkEmail, trigger: 'blur' }],
                newPassword: [{ required: true, message: "请输入密码", trigger: "blur" },{ validator: validatePass, trigger: "blur" }],
                checkPassword: [{ required: true, message: "请再次输入密码", trigger: "blur" },{ validator: validatePass2, trigger: "blur" }],
            },
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
            this.time = 60
            this.btnColor = false
            this.timer()
            const phoneParams={mail: this.checkForm.email}
            requestMss(phoneParams).then(res => {
                let {msg, code} = res;
                if (code === '200') {
                    this.$message.success(msg)
                } else if (code === '400') {
                    this.$message.error(msg);
                }
            });
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
        // 修改密码
        verificationCode () {
            this.$refs.checkForm.validate((valid) => {
                if (valid) {
                    const regParams = {code:this.checkForm.verifyNum,email:this.checkForm.email,password:this.checkForm.newPassword}
                    console.log(regParams)
                    editPwd(regParams).then(res => {
                        let {msg, code} = res
                        if (code !== '200') {
                            this.$message.error(msg);
                        } else if(code==='200'){
                            this.$message.success(msg)
                            this.$router.push('/login')
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

.check-container {
    border-radius: 15px;
    margin: 10px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
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
