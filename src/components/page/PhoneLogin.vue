<template>
    <div>
        <el-form :model="phoneForm" ref="phoneForm" class="check-container" label-position="left"
                 label-width="0px" :rules="rules" >
            <h3 class="check_title">邮箱登录</h3>
            <el-form-item prop="email">
                <el-input type="text" v-model="phoneForm.email"
                          auto-complete="off" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item prop="verifyNum">
                <div class="iden">
                    <el-input type="text" v-model="phoneForm.verifyNum" style=""
                              auto-complete="off" @keyup.enter.native="verificationCode"
                              placeholder="请输入验证码"></el-input>
                    <el-button :style="{background:btnColor?'#2E9AFE':'#617079',color:'#FFF',width:'50%'}"
                               v-on:click="sendSmsCode"
                               class="verify-btn" v-model="btnContent"
                               v-bind="{'disabled':disabled}">
                        {{ btnContent }}
                    </el-button>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width: 100%;border: none"
                           v-on:click="verificationCode">
                    登录
                </el-button>
            </el-form-item>
            <el-link :underline="false" class="back-link" @click="back()">返回</el-link>
        </el-form>
    </div>
</template>

<script>
import {requestEmailLogin, requestLogin, requestMss, requestPhoneLogin} from '../../api/api'

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
        return {
            phoneForm:{
                email: '',
                verifyNum: '', //验证码
            },
            rules: {
                verifyNum: [{ required: true, message: "请输入验证码", trigger: "blur" }],
                email: [{ required: true, message: "请输入邮箱", trigger: "blur" },
                    { validator: checkEmail, trigger: 'blur' }],
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
            // 获取验证码请求
            const phoneParams={mail: this.phoneForm.email}
            requestMss(phoneParams).then(res => {
                let {msg, code} =res;
                if (code === '200') {
                    this.$message.success(msg)
                } else if (code === 400) {
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
        // 验证验证码
        verificationCode () {
            this.$refs.phoneForm.validate((valid) => {
                if (valid) {
                    const params = {mail:this.phoneForm.email,code:this.phoneForm.verifyNum}
                    requestEmailLogin(params).then(res => {
                        let {msg, code, user, token} = res
                        if (code == '300') {
                            this.$message.error(msg)
                        } else if(code =='200'){
                            this.$store.commit('login', res.data);
                            this.$store.commit('login2', token);
                            this.$router.push({ path: '/home' });
                            this.$message.success(msg);
                        }else if(code == '400'){
                            this.$message.error(msg)
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        back () {
            this.$router.push('/login')
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
