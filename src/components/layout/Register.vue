<template>
    <div class="reg-container">
        <h3 class="check_title">注册</h3>
        <el-form :model="regForm" :rules="rules" ref="regForm"  label-position="right" size="small"
                 label-width="25%" >
            <el-form-item label="用户名" prop="userName">
                <el-input type="text" v-model="regForm.userName" auto-complete="off" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="真实姓名" prop="realName">
                <el-input type="text" v-model="regForm.realName" auto-complete="off" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                    <el-radio v-model="regForm.sex" label="0">女</el-radio>
                    <el-radio v-model="regForm.sex" label="1">男</el-radio>
            </el-form-item>
            <el-form-item label="职称" prop="title">
                <el-select v-model="regForm.title" placeholder="请选择职称">
                    <el-option
                        v-for="item in title"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="科室" prop="department">
                <el-select v-model="regForm.department" placeholder="请选择科室">
                    <el-option
                        v-for="item in department"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
                <el-input type="text" v-model="regForm.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input type="text" v-model="regForm.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="密码"  prop="passWord">
                <el-input type="password" v-model="regForm.passWord" placeholder="请输入6 - 18位密码，区分大小写"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPassword">
                <el-input type="password" v-model="regForm.checkPassword" placeholder="请输入6 - 18位密码，区分大小写"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="roleId">
                <el-radio v-model="regForm.roleId" label="1">教师</el-radio>
                <el-radio v-model="regForm.roleId" label="2">学生</el-radio>
            </el-form-item>
            <el-form-item label-width="0px">
                <el-button type="primary" style="width: 100%;border: none"
                           v-on:click.stop="register()">
                    确定
                </el-button>
            </el-form-item>
            <el-link :underline="false" class="back-link" @click="back()">返回</el-link>
        </el-form>
    </div>
</template>

<script>
import {requestTitle, requireRegister} from '../../api/api'

export default {
    name: 'Register',
    data () {
        // 自定义验证邮箱规则，后在addeFormRules中使用
        var checkEmail = (rule, value, cb) => {
            // 验证邮箱的正则表达式
            const regEmail = /^[A-Za-z0-9]+([_.][A-Za-z0-9]+)*@([A-Za-z0-9-]+\.)+[A-Za-z]{2,6}$/

            if (regEmail.test(value)) {
                // 合法的邮箱
                return cb()
            }

            cb(new Error('请输入合法的邮箱'))
        };
        var checkUsername = (rule, value, cb) => {
            // 验证邮箱的正则表达式
            const regEmail = /^[A-Za-z0-9]+$/

            if (regEmail.test(value)) {
                // 合法的邮箱
                return cb()
            }
            cb(new Error('请输入字母或数字'))
        };
        // 自定义验证手机号规则，后在addeFormRules中使用
        var checkMobile = (rule, value, cb) => {
            // 先定义一个验证手机号的正则表达式
            const regMobile = /^1[34578]\d{9}$/
            // 合法： regMobile.test(value)进过测试后放回的值
            if (regMobile.test(value)) {
                return cb()
            }
            // 不合法
            cb(new Error('请输入合法的手机号'))
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
            } else if (value !== this.regForm.passWord) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        return {
            title: [{
                value: '住院医师',
                label: '住院医师'
            }, {
                value: '主治医师',
                label: '主治医师'
            }, {
                value: '副主任医师',
                label: '副主任医师'
            }, {
                value: '主任医师',
                label: '主任医师'
            }, {
                value: '助理医师',
                label: '助理医师'
            },
            ],
            department: [{
                value: '心脏内科',
                label: '心脏内科'
            }, {
                value: '心胸外科',
                label: '心胸外科'
            }, {
                value: '妇产科',
                label: '妇产科'
            }, {
                value: '骨科',
                label: '骨科'
            }, {
                value: '麻醉科',
                label: '麻醉科'
            },
            ],
            regForm: {
                userName:"",
                realName:'',
                sex:'',
                title:'',
                department:'',
                phone:'',
                email:"",
                passWord:"",
                checkPassword:"",
                roleId:'0'
            },
            rules: {
                userName: [{ required: true, message: "请输入用户名", trigger: "blur" },
                    { validator: checkUsername, trigger: 'blur' }],
                realName: [{ required: true, message: "请输入真实姓名", trigger: "blur" }],
                phone: [{ required: true, message: "请输入手机号", trigger: "blur" },
                    { validator: checkMobile, trigger: 'blur' }],
                department: [{ required: true, message: "请选择科室", trigger: "blur" }],
                email: [{ required: true, message: "请输入邮箱", trigger: "blur" },
                    { validator: checkEmail, trigger: 'blur' }],
                passWord: [{ required: true, message: "请输入密码", trigger: "blur" },
                    { validator: validatePass, trigger: "blur" }],
                checkPassword: [{ required: true, message: "请再次输入密码", trigger: "blur" },
                    { validator: validatePass2, trigger: "blur" }],
                roleId:[{ required: true, message: "请选择角色", trigger: "blur" }]
            },
        }
    },
    created () {
        this.getTitle()
        this.getDepartment()
    },
    methods: {
        getTitle(){
            this.title=[]
            var param={typeCode:'title'}
            requestTitle(param).then(res => {
                console.log(res)
                let {msg, code,} = res
                if (code !== '200') {
                    this.$message.error(msg);
                } else if(code === '200'){
                    for(var i=0;i<res.data.length;i++){
                        var item={value:'',label:''}
                        item.label=res.data[i].name
                        item.value=res.data[i].name
                        this.title.push(item)
                    }
                }
            })
        },
        getDepartment(){
            this.department=[]
            var param={typeCode:'department'}
            requestTitle(param).then(res => {
                console.log(res)
                let {msg, code,} = res
                if (code !== '200') {
                    this.$message.error(msg);
                } else if(code === '200'){
                    for(var i=0;i<res.data.length;i++){
                        var item={value:'',label:''}
                        item.label=res.data[i].name
                        item.value=res.data[i].name
                        this.department.push(item)
                    }
                }
            })
        },
        // 验证验证码
        register () {
            this.$refs.regForm.validate((valid) => {
                if (valid) {
                    const regParams = this.regForm
                     requireRegister(regParams).then(res => {
                        let {msg, code,} = res
                        if (code !== '101') {
                            this.$message.error(msg);
                        } else if(code === '101'){
                            this.$message.success(msg)
                            var path = this.$route.query.redirect
                            this.$router.push( "/login");
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        back(){
            this.$router.push( "/login");
        }
    }
}
</script>

<style scoped>
.reg-container {
    border-radius: 15px;
    top:auto ;
    margin-left:auto;
    margin-right: auto;
    width: 380px;
    padding: 0px 35px 8px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 20px #cac6c6;
    opacity: 0.9;
}
.back-link {
    position: relative;
    left: 195px;
    color: #505458;
    font-size: 13px;
}
</style>
