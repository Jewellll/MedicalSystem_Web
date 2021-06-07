<template>
    <div>
        <el-form ref="checkForm" class="check-container" label-position="left"
                 label-width="0x">
            <h3 class="check_title">验证手机</h3>
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
export default {
    data () {
        return {
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
                this.$message.error({
                    message: '手机号不能为空',
                    center: true
                })
                return
            }
            if (!reg.test(phoneNum)) {//手机号不合法
                this.$message.error({
                    message: '手机号格式不正确',
                    center: true
                })
                return
            }
            this.time = 60
            this.btnColor = false
            this.timer()
            // 获取验证码请求
            this.$axios
                .post('/send', {
                    phoneNum: this.phoneNum,
                })
                .then(res => {
                    if (res.data.code === 200) {
                        this.$message('发送成功')
                    }
                    if (res.data.code === 400) {
                        this.$message.error("发送失败");
                    }
                })
                .catch(failResponse => {});
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
            var reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$///手机号正则验证
            var phoneNum = this.phoneNum
            if (!phoneNum) {//未输入手机号
                this.$message.error({
                    message: '手机号不能为空',
                    center: true
                })
                return
            }
            if (!reg.test(phoneNum)) {//手机号不合法
                this.$message.error({
                    message: '手机号格式不正确',
                    center: true
                })
                return
            }
            this.$axios
                .post('/check', {
                    phoneNum: this.phoneNum,
                    verifyNum: this.verifyNum
                })
                .then(res => {
                    if (res.data.code === 200) {
                        this.$message('验证成功')
                        var path = this.$route.query.redirect
                        this.$router.replace({
                            path: path === '/' || path === undefined ? '/forgetpassword' : path
                        });
                    }
                    if (res.data.code === 400) {
                        this.$message.error("验证失败");
                    }
                })
                .catch(failResponse => {});
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
