<template>
        <div class="forget">
            <div class="title">修改密码</div>
            <el-form :model="forgetForm" :rules="rules" ref="forgetForm" class="forget-container">
                <el-form-item label="旧密码" prop="password">
                    <el-input type="password" v-model="forgetForm.password" placeholder="请输入旧密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input type="password" v-model="forgetForm.newPassword" placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="checkPassword">
                    <el-input type="password" v-model="forgetForm.checkPassword" placeholder="请再次输入新密码"></el-input>
                </el-form-item>
                <el-form-item>
                        <el-button type="primary" style="width: 100%"  @click.native.prevent="change">确定修改</el-button>
                </el-form-item>
            </el-form>
        </div>
</template>

<script>
export default {
    name: 'ForgetPassword',
    data() {
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
            } else if (value !== this.forgetForm.newPassword) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        return {
            forgetForm: {
                password:"",
                newPassword:"",
                checkPassword:""
            },
            rules: {
                password: [{ required: true, message: "请输入密码", trigger: "blur" }],
                newPassword: [{ validator: validatePass, trigger: "blur" }],
                checkPassword: [{ validator: validatePass2, trigger: "blur" }]
            }
        }
    },
    methods: {
        change(){
            this.$refs.forgetForm.validate((valid) => {
                if (valid) {
                    this.$axios
                        .post('/forget', {
                            password: this.forgetForm.password,
                        })
                        .then(res => {
                            if (res.data.code === 200) {
                                var path = this.$route.query.redirect
                                this.$router.replace({
                                    path: path === '/' || path === undefined ? '/login' : path
                                });
                            }
                            if (res.data.code === 400) {
                                this.$message.error("旧密码错误");
                            }
                        })
                        .catch(failResponse => {});
                } else {
                    this.$message.error('请输入账号和密码')
                    return false
                }
            })
        }
    }
}
</script>

<style scoped>
.title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
}
.forget {
    border-radius: 15px;
    margin: 20px auto;
    width: 350px;
    padding: 30px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    opacity: 0.9;
}
.passwordreset-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
</style>
